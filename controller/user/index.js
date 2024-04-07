var express = require("express");
var router = express.Router();
var database = require("../../database/database");
const mongodb = require("mongodb");
var controller = require("./controller");
const bcrypt =require("bcrypt")

router.get("/", controller.home);

router.get("/cart/:id", controller.cart);
router.get("/signup", controller.signup);

router.post("/signup", (req, res) => {
  let datas = {
    name: req.body.uName,
    email: req.body.uEmail,
    password: req.body.uPassword,
    Cpassword: req.body.uCPassword,
  };
  database.then((dbase) => {
    bcrypt.hash
    dbase
      .collection("signup")
      .insertOne(datas)
      .then((result) => {
        res.redirect("/user");
      });
  });
});
router.get("/login", controller.login);

router.post("/login", (req, res) => {
  var loginDatas = { email: req.body.LogEmail, password: req.body.LogPassword };

  database.then((dbase) => {
    dbase.collection("signup").findOne({email:loginDatas.email}).then((logresult)=>{
      console.log(logresult);
      res.render("user/login");
    });
  });
});

module.exports = router;
