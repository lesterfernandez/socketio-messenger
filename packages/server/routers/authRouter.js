const pg = require("../db");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const { getUserByUsername } = require("../connectors/getUser");
const { isAuth } = require("../connectors/isAuth");

router
  .route("/login")
  .post(async (req, res) => {
    const potentialUser = { ...req.body };
    let newUser = {};

    const queriedUser = await getUserByUsername(potentialUser.username);

    if (queriedUser.rowCount === 0) {
      const hashedPass = await bcrypt.hash(potentialUser.password, 10);

      const newInsert = await pg.query(
        "INSERT INTO users(username, passhash) values($1, $2) RETURNING id, username",
        [potentialUser.username, hashedPass]
      );

      newUser = {
        username: newInsert.rows[0].username,
        id: newInsert.rows[0].id,
        loggedIn: true,
      };

      req.session.user = { username: newUser.username, id: newUser.id };
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

        req.session.user = { username: newUser.username, id: newUser.id };
      } else {
        newUser = { loggedIn: false };
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

module.exports = router;
