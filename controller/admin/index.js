var express = require("express");
var router = express.Router();
var database = require("../../database/database");
const mongodb = require("mongodb");
var controller = require("./controller");

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
        fileup
          .mv("./public/images/category/" + categorys.Catimage)
          .then((results) => {
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
    imgUpdate.mv("./public/images/category/" + Ucategorys.Catimage);
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

router.post("/addCommodity", (req, res) => {
  let commodityData = {
    Catname: req.body.Catname,
    product: req.body.product,
    quantity: req.body.quantity,
    price: req.body.price,
    description: req.body.description,
    image: req.files.image.name,
  };
  database.then((dbase) => {
    dbase
      .collection("commodity")
      .insertOne(commodityData)
      .then((reslt) => {
        const fileUp = req.files.image;
        fileUp
          .mv("./public/images/commodity/" + commodityData.image)
          .then((rslt) => {});
      });
    res.redirect("/addCommodity");
  });
});

router.get("/editCommodity/:id", controller.editCommodity);

router.post("/editCommodity/:id", (req, res) => {
  let id = req.params.id;
  let data = {
    product: req.body.products,
    quantity: req.body.quantitys,
    price: req.body.prices,
    description: req.body.descriptions,
    image: req.files?.images.name,
  };
  let updateCommodity = "";
  if (req.files?.images) {
    updateCommodity = {
      product: data.product,
      quantity: data.quantity,
      price: data.price,
      description: data.description,
      image: data.image,
    };
    let imgUpdate = req.files.images;
    imgUpdate.mv("./public/images/commodity/" + data.image);

  } else {
    updateCommodity = {
      product: data.product,
      quantity: data.quantity,
      price: data.price,
      description: data.description,
    };
  }

  database.then((dbase) => {
    dbase
      .collection("commodity")
      .updateOne({ _id: new mongodb.ObjectId(id) }, { $set: updateCommodity })
      .then((result) => {
        res.redirect("/addCommodity");
      });
  });
});

// router.post("/editCommodity/:id", (req, res) => {
//   res.redirect("/addCommodity")
// })

module.exports = router;
