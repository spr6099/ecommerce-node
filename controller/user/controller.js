const mongodb = require("mongodb");
var database = require("../../database/database");

exports.home = function (req, res) {
  res.render("user/home")
};
exports.user = function (req, res) {
  database.then((dbase) => {
    dbase
      .collection("commodity")
      .find({})
      .toArray()
      .then((commodity) => {
        res.render("user/user", { commodity });
      });
  });
};

exports.cart = (async(req, res) => {
  if(req.sesssion.user){
  let id = req.params.id;
  
  await database.then((dbase) => {
    dbase
      .collection("commodity")
      .findOne({ _id: new mongodb.ObjectId(id) })
      .then((cart) => {
        res.render("user/cart", { cart });
        console.log(cart);
      });
  });
}else{
  res.redirect("/login")
}  
}); 

exports.signup = (req, res) => {
  res.render("user/signup");
};

exports.login = (req, res) => {
  if(req.session.user){
  res.render("user/login",{login:true});
} else{
  res.render("user/login",{login:false})
}
};
  