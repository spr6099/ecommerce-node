var database = require("../../database/database");
const mongodb = require("mongodb");

/* GET home page. */
exports.adminHome = function (req, res, next) {
  res.render("admin/index");
};

exports.addCategoryHome = function (req, res, next) {
  database.then((dbase) => {
    dbase
      .collection("addCategory")
      .find({})
      .toArray()
      .then((result) => {
        res.render("admin/addCategory", { result });
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
        res.render("admin/updateCategory", { resultId });
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
        res.redirect("/addCategory");
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
    res.render("admin/addSubcategory", { catResult, subCatResult });
    // console.log(subCatResult);
  });
};

// exports.subCatEdit = (req, res) => {
//   let id = req.params.id;
//   database.then(async (dbase) => {
//     const subCatDb = await dbase
//       .collection("subcategory")
//       .findOne({ _id: new mongodb.ObjectId(id) });
//     let idP = subCatDb.parentCategory;
//     const categoryDb = await dbase
//       .collection("addCategory")
//       .findOne({ _id: new mongodb.ObjectId(idP) });
//     console.log({ subCatDb });
//     console.log({ idP });
//     res.render("admin/editSubcategory", { categoryDb, subCatDb });
//   });
// };

exports.subCatEdit=(req,res)=>{
      let id = req.params.id;
      database.then(async (dbase) => {
        const categoryDb = await dbase
              .collection("addCategory").find().toArray()
            const subCatDb = await dbase
              .collection("subcategory")
                    .findOne({ _id: new mongodb.ObjectId(id) });
                        console.log({ categoryDb });
                        console.log({ subCatDb });
    res.render("admin/editSubcategory", { categoryDb, subCatDb });
}
      )}

exports.subCatDelete= (req, res) => {
  let id = req.params.id;
  database.then((dbase) => {
    dbase
      .collection("subcategory")
      .deleteOne({ _id: new mongodb.ObjectId(id) })
      .then((result) => {
        res.redirect("/addSubcategory");
      });
  });
};

exports.addcommodity=(req, res) => {
  res.render("admin/addCommodity");
};

