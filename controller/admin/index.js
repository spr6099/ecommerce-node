var express = require("express");
var router = express.Router();
var database = require("../../database/database");
const mongodb = require("mongodb");
var controller = require("./controller")

/* GET home page. */
router.get("/", controller.adminHome);

router.get("/addCategory", controller.addCategoryHome);

router.post("/addCategory", function (req, res, next) {
  var categorys = {
    Catname: req.body.category,
    Catdescription: req.body.description,
    Catimage: req.files.image.name, // postimage
  };

  database.then((dbase) => {
    dbase
      .collection("addCategory")
      .insertOne(categorys)
      .then((result) => {
        const fileup = req.files.image;
        fileup.mv("./public/images/" + categorys.Catimage).then((results) => {
          console.log(results);
        });
      });
    res.redirect("/addCategory");
  });
});

router.get("/updateCategory/:id", controller.updateCat);

router.post("/updateCategory/:id", (req, res) => {
  let id = req.params.id;
  var Ucategorys = {
    Catname: req.body.Ucategory,
    Catdescription: req.body.Udescription,
    Catimage: req.files?.images.name, // postimage
  };
  let updatecat = "";
  if (req.files?.images) {
    updatecat = {
      Catname: Ucategorys.Catname,
      Catdescription: Ucategorys.Catdescription,
      Catimage: Ucategorys.Catimage, // postimage
    };
    let imgUpdate = req.files.images;
    imgUpdate.mv("./public/images/" + Ucategorys.Catimage);
  } else {
    updatecat = {
      Catname: Ucategorys.Catname,
      Catdescription: Ucategorys.Catdescription,
    };
  }
  database.then((dbase) => {
    dbase
      .collection("addCategory")
      .updateOne({ _id: new mongodb.ObjectId(id) }, { $set: updatecat })
      .then((result) => {
        console.log(result);
        res.redirect("/addCategory");
      });
  });
});

router.get("/deleteCategory/:id", controller.deleteCat);

router.get("/addSubcategory", controller.addSubCat);

router.post("/addSubcategory", (req, res) => {
  var subCategorys = {
    parentCategory: req.body.Catname,
    subCategory: req.body.subCategory,
  };
  database.then((dbase) => {
    dbase
      .collection("subcategory")
      .insertOne(subCategorys)
      .then((result) => {
        // console.log(result);
        res.redirect("/addSubcategory");
      });
  });
});

router.get("/subCatEdit/:id", controller.subCatEdit);

router.post("/subCatEdit/:id", (req, res) => {
  let id = req.params.id;
  let subCategory = { subCategory: req.body.UsubCategory };
  database.then((dbase) => {
    dbase
      .collection("subcategory")
      .updateOne({ _id: new mongodb.ObjectId(id) }, { $set: subCategory })
      .then((result) => {
        res.redirect("/addSubcategory");
      });
  });
});

router.get("/subCatDelete/:id", controller.subCatDelete);

router.get("/addCommodity", controller.addcommodity);

module.exports = router;
