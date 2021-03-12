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

const SearchFactors = (searchFilters, callback) => {
  if (!searchFilters) return;
  const sf = searchFilters;
  if(sf.checked1 === true && sf.checked2 === true){
    db.find(
      {
        $and: [
          { docType: "factor" },
          { factorDate: { $gte: sf.fromm } },
          { factorDate: { $lte: sf.till } },
        ],
      },
      function (err, docs) {
        if (err) throw err;
        if (typeof callback === "function") {
          callback(docs);
        }
      }
    );
  }
  else if(sf.checked1 === true){
    db.find(
      {
        $and: [
          { docType: "factor" },
          { isPayed: true },
          { factorDate: { $gte: sf.fromm } },
          { factorDate: { $lte: sf.till } },
        ],
      },
      function (err, docs) {
        if (err) throw err;
        if (typeof callback === "function") {
          console.log('on naghdi', docs);
          callback(docs);
        }
      }
    );
  }
  else if(sf.checked2 === true){
    db.find(
      {
        $and: [
          { docType: "factor" },
          { isPayed: false },
          { factorDate: { $gte: sf.fromm } },
          { factorDate: { $lte: sf.till } },
        ],
      },
      function (err, docs) {
        if (err) throw err;
        if (typeof callback === "function") {
          console.log('on nesye', docs);
          callback(docs);
        }
      }
    );
  }
};

const insert = (factor, callback) => {
  objectCreator.createFactor(factor, (newFactor) => {
    db.insert( newFactor , function () {
      if (typeof callback === "function") {
        callback();
      }
    });
  })
};

module.exports = {
  getAll, insert, factorsWithProduct, SearchFactors
};
