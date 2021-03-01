const { db } = require("../db");

const getAll = (callback) => {
  db.find({ doc: "products" }, (err, docs) => {
    if (err) throw err;
    if (typeof callback === "function") {
      callback(docs);
    }
  });
};

const insert = (obj = {}, callback) => {
  if (typeof obj !== "object") {
    return;
  }
  db.update({ doc: "products" }, { $addToSet: { data: obj } }, {}, function () {
    if (typeof callback === "function") {
      callback();
    }
  });
};

module.exports = {
  getAll, insert
};
