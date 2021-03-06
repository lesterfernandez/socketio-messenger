const pg = require("../db");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const { getUserByUsername } = require("../connectors/getUser");
const { isAuth } = require("../connectors/isAuth");
const { v4: uuidv4 } = require("uuid");

router
  .route("/login")
  .post(async (req, res) => {
    const potentialUser = { ...req.body };
    let newUser = {};

    const queriedUser = await getUserByUsername(potentialUser.username);

    if (queriedUser.rowCount === 0) {
      newUser = {
        loggedIn: false,
        status: "Wrong username or password",
      };
    } else {
      const usersMatch = await bcrypt.compare(
        potentialUser.password,
        queriedUser.rows[0].passhash
      );

      if (usersMatch) {
        newUser = {
          loggedIn: true,
          id: queriedUser.rows[0].id,
          username: potentialUser.username,
        };

        req.session.user = {
          username: newUser.username,
          id: newUser.id,
          userID: queriedUser.rows[0].userid,
        };
      } else {
        newUser = {
          loggedIn: false,
          status: "Wrong username or password",
        };
      }
    }

    res.json({ ...newUser });
  })
  .get(isAuth, (req, res) => {
    res.json({
      loggedIn: true,
      username: req.session.user.username,
      id: req.session.user.id,
    });
  });

router.route("/register").post(async (req, res) => {
  const potentialUser = { ...req.body };
  let newUser = {};

  const queriedUser = await getUserByUsername(potentialUser.username);

  if (queriedUser.rowCount === 0) {
    const hashedPass = await bcrypt.hash(potentialUser.password, 10);

    const newInsert = await pg.query(
      "INSERT INTO users(username, passhash, userID) values($1, $2, $3) RETURNING id, username, userID",
      [potentialUser.username, hashedPass, uuidv4()]
    );

    newUser = {
      username: newInsert.rows[0].username,
      id: newInsert.rows[0].id,
      loggedIn: true,
    };

    req.session.user = {
      username: newUser.username,
      id: newUser.id,
      userID: newInsert.rows[0].userid,
    };
  } else {
    newUser = { loggedIn: false, status: "Username taken" };
  }

  res.json({ ...newUser });
});

module.exports = router;
