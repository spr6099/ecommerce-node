var mongodb = require("mongodb").MongoClient;
var mongod = new mongodb("mongodb://localhost:27017");

function database() {
  return mongod.connect().then((dbase) => {
    var database1 = dbase.db("ecommerce");
    return database1;
  });
}

module.exports = database();