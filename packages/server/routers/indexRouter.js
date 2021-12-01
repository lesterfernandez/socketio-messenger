const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json("hi from api");
});

module.exports = router;
