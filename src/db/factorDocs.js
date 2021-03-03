const { db } = require("../db");

const getAll = (callback) => {
  db.find({ docType: 'factor' }, (err, docs) => {
    if (err) throw err;
    if (typeof callback === "function") {
      callback(docs);
    }
  });
};

const factorsWithProduct = (id, callback) => {
  if(!id) return;
  db.find({ "products.productId": id }, (err, docs) => {
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
  db.insert( obj , function () {
    if (typeof callback === "function") {
      callback();
    }
  });
};

module.exports = {
  getAll, insert, factorsWithProduct
};
