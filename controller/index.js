var express = require("express");
var router = express.Router();
var admin = require("./admin");

router.use("/", admin);

module.exports = router;
