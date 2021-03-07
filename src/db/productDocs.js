const { db } = require("../db");
const objectCreator = require('../modules/objectCreator');

const getAll = (callback) => {
  db.find({ docType: 'product' }, (err, docs) => {
    if (err) throw err;
    if (typeof callback === "function") {
      callback(docs);
    }
  });
};

const getUnFinishedProducts = (callback) => {
  db.find({ $and: [{ docType: 'product' }, { isProductFinish: false }] }, function (err, docs) {
    if(err) throw err;
    if (typeof callback === "function") {
      callback(docs);
    }
  });
}

const getOneProduct = (id, callback) => {
  if(!id) return;
  db.findOne({ customeId: id }, function (err, doc) {
    if(err) throw err;
    if (typeof callback === "function") {
      callback(doc);
    }
  });
}


const insert = (product, callback) => {
  objectCreator.createProduct(product, (obj) => {
    db.insert( obj , function (err) {
      if (err) throw err;
      if (typeof callback === "function") {
        callback();
      }
    });
  })
};

module.exports = {
  getAll, insert, getUnFinishedProducts, getOneProduct
};
