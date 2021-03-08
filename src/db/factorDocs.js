const { db } = require("../db");
const objectCreator = require('../modules/objectCreator');

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

const insert = (factor, callback) => {
  objectCreator.createFactor(factor, callback)
  db.insert( factor , function () {
    if (typeof callback === "function") {
      callback();
    }
  });
};

module.exports = {
  getAll, insert, factorsWithProduct
};
