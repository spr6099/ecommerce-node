const mongodb = require("mongodb");
var database = require("../../database/database");

/* GET home page. */
exports.adminHome = function (req, res, next) {
  res.render("admin/admin",{admin:true});
};

exports.addCategoryHome = function (req, res, next) {
  database.then((dbase) => {
    dbase
      .collection("addCategory")
      .find({})
      .toArray()
      .then((result) => {
        res.render("admin/addCategory", { result ,admin:true});
      });
  });
  // res.render("addCategory");
};

exports.updateCat = (req, res) => {
  let id = req.params.id;
  database.then((dbase) => {
    dbase
      .collection("addCategory")
      .findOne({ _id: new mongodb.ObjectId(id) })
      .then((resultId) => {
        res.render("admin/updateCategory", { resultId ,admin:true});
      });
  });
};

exports.deleteCat = (req, res) => {
  let id = req.params.id;
  database.then((dbase) => {
    dbase
      .collection("addCategory")
      .deleteOne({ _id: new mongodb.ObjectId(id) })
      .then((result) => {
        res.redirect("/admin/addCategory",{admin:true});
      });
  });
};

exports.addSubCat = (req, res) => {
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
    res.render("admin/addSubcategory", { catResult, subCatResult ,admin:true});
  });
};

exports.subCatEdit = (req, res) => {
  let id = req.params.id;
  database.then(async (dbase) => {
    const categoryDb = await dbase.collection("addCategory").find().toArray();
    // const subCatDb1 = await dbase
    // .collection("subcategory")
    // .aggregate([
    //   { $addFields: { catogoryId: { $toObjectId: "$parentCategory" } } },
    //   {
    //     $lookup: {
    //       from: "addCategory",
    //       localField: "catogoryId",
    //       foreignField: "_id",
    //       as: "lookupdatas",
    //     },
    //   },
    //   { $unwind: "$lookupdatas" },
    // ])
    // .toArray();
    const subCatDb = await dbase
      .collection("subcategory")
      .findOne({ _id: new mongodb.ObjectId(id) });
    res.render("admin/editSubcategory", { categoryDb, subCatDb,admin:true });
  });
};

exports.subCatDelete = (req, res) => {
  let id = req.params.id;
  database.then((dbase) => {
    dbase
      .collection("subcategory")
      .deleteOne({ _id: new mongodb.ObjectId(id) })
      .then((result) => {
        res.redirect("/admin/addSubcategory",{admin:true});
      });
  });
};

exports.addcommodity = (req, res) => {
  database.then(async (dbase) => {
    const categoryDB = await dbase.collection("addCategory").find({}).toArray();
    const commodityDB = await dbase
      .collection("commodity")
      .aggregate([
        { $addFields: { categoryId: { $toObjectId: "$Catname" } } },
        {
          $lookup: {
            from: "addCategory",
            localField: "categoryId",
            foreignField: "_id",
            as: "lookupData",
          },
        },
        { $unwind: "$lookupData" },
      ])
      .toArray();
    res.render("admin/addCommodity", { categoryDB, commodityDB ,admin:true});
  });
};

exports.editCommodity = (req, res) => {
  let id = req.params.id;
  database.then(async (dbase) => {
    const categoryDB = await dbase.collection("addCategory").find({}).toArray();
    const commodityDb = await dbase
      .collection("commodity")
      .findOne({ _id: new mongodb.ObjectId(id) });
    res.render("admin/editCommodity", { categoryDB, commodityDb ,admin:true});
  });
};
