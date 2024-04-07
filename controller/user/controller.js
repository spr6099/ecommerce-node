const mongodb = require("mongodb");
var database = require("../../database/database");

exports.home = function (req, res) {
  database.then((dbase) => {
    dbase
      .collection("commodity")
      .find({})
      .toArray()
      .then((commodity) => {
        res.render("user/home", { commodity });
      });
  });
};

exports.cart = (req, res) => {
  let id = req.params.id;
  database.then((dbase) => {
    dbase
      .collection("commodity")
      .findOne({ _id: new mongodb.ObjectId(id) })
      .then((cart) => {
        res.render("user/cart", { cart });
        console.log(cart);
      });   
  });
};

exports.signup=(req,res)=>{
    res.render("user/signup")
}

exports.login = (req,res)=>{
    res.render("user/login")
}
