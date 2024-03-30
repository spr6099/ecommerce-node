var express = require("express");
var router = express.Router();
var database = require("../database");
const mongodb = require("mongodb");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/addCategory", function (req, res, next) {
  database.then((dbase) => {
    dbase
      .collection("addCategory")
      .find({})
      .toArray()
      .then((result) => {
        res.render("addCategory", { result });
      });
  });
  // res.render("addCategory");
});

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

router.get("/updateCategory/:id", (req, res) => {
  let id = req.params.id;
  database.then((dbase) => {
    dbase
      .collection("addCategory")
      .findOne({ _id: new mongodb.ObjectId(id) })
      .then((resultId) => {
        res.render("updateCategory", { resultId });
      });
  });
});

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

router.get("/deleteCategory/:id", (req, res) => {
  let id = req.params.id;
  database.then((dbase) => {
    dbase
      .collection("addCategory")
      .deleteOne({ _id: new mongodb.ObjectId(id) })
      .then((result) => {
        res.redirect("/addCategory");
      });
  });
});

router.get("/addSubcategory", (req, res) => {
  database.then(async (dbase) => {
    const catResult = await dbase.collection("addCategory").find({}).toArray();
    const subCatResult = await dbase
      .collection("subcategory")
      .aggregate([
        { $addFields: { catogoryId: { $toObjectId: "$parentCategory" } } },
        {
          $lookup: {
            from: "addCategory",
            localField: "catogoryId",
            foreignField: "_id",
            as: "newdatas",
          },
        },
        { $unwind: "$newdatas" },
      ])
      .toArray();
    res.render("addSubcategory", { catResult, subCatResult });
    // console.log(subCatResult);
  });
});

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

router.get("/subCatEdit/:id", (req, res) => {
  let id = req.params.id;
  database.then(async (dbase) => {
    const subCatDb = await dbase
      .collection("subcategory")
      .findOne({ _id: new mongodb.ObjectId(id) });
    let idP = subCatDb.parentCategory;

    const categoryDb = await dbase
      .collection("addCategory")
      .findOne({ _id: new mongodb.ObjectId(idP) });
    console.log({ subCatDb });
    console.log({ idP });

    res.render("editSubcategory", { categoryDb, subCatDb });
  });
});

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

router.get("/subCatDelete/:id", (req, res) => {
  let id = req.params.id;
  database.then((dbase) => {
    dbase
      .collection("subcategory")
      .deleteOne({ _id: new mongodb.ObjectId(id) })
      .then((result) => {
        res.redirect("/addSubcategory");
      });
  });
});


module.exports = router;
