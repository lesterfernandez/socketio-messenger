const router = require("express").Router();

router
  .route("/login")
  .post((req, res) => {
    console.log(req.body);
    res.status(200).json({ loggedIn: true });
  })
  .get((_, res) => {
    res.json({ loggedIn: true });
  });

module.exports = router;
