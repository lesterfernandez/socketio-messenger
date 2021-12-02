const express = require("express");
const router = express.Router();

router.get("/", (_, res) => {
  res.json("hi from api");
});

module.exports = router;
