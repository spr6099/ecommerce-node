var express = require("express");
var router = express.Router();
var database = require("../../database/database");
const mongodb = require("mongodb");
var controller = require("./controller");
const bcrypt = require("bcrypt");

router.get("/",controller.home)
router.get("/user", controller.user);

router.get("/cart/:id", controller.cart);
router.get("/signup", controller.signup);

router.post("/signup", (req, res) => {
  var datas = {
    name: req.body.uName,
    email: req.body.uEmail,
    password: req.body.uPassword,
    Cpassword: req.body.uCPassword,
  };
  database.then((dbase) => {
    bcrypt.hash(req.body.uPassword, 10).then((passresult) => {
      datas.password = passresult;
      dbase
        .collection("signup")
        .insertOne(datas)
        .then((result) => {
          res.redirect("/user");
          console.log(result);
        });
    });
  });
});

router.get("/login", controller.login);

router.post("/login", (req, res) => {
  
  var loginDatas = {
    Lemail: req.body.LogEmail,
    Lpassword: req.body.LogPassword,
  };
  database.then((dbase) => {
    dbase
      .collection("signup")
      .findOne({ email: loginDatas.Lemail })
      .then((result) => {
        let logResult = result;
        if (loginDatas) {
          bcrypt
            .compare(loginDatas.Lpassword, logResult.password)
            .then((pass) => {
              if (pass) {
                req.session.user=logResult;
                res.redirect("/user")
              } else { 
                req.session.user=logResult;
                res.send(" password mismatch");
              }
            });
        } else {
          res.send("login Datas error")
        }
      });
  });
});



module.exports = router;
