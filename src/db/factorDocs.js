const { db } = require("../db");
const objectCreator = require("../modules/objectCreator");
const calcSumFactor = require("../calculators/calcSumFactor");

const getAll = (callback) => {
  db.find({ docType: "factor" }, (err, docs) => {
    if (err) throw err;
    if (typeof callback === "function") {
      callback(docs);
    }
  });
};

const getOne = (id, callback) => {
  if (!id) return;
  db.find(
    {
      $and: [{ docType: "factor" }, { customeId: id }],
    },
    function (err, docs) {
      if (err) throw err;
      if (typeof callback === "function") {
        callback(docs[0]);
      }
    }
  );
};

const factorsWithProduct = (id, callback) => {
  if (!id) return;
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
  if (sf.checked1 === true && sf.checked2 === true) {
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
  } else if (sf.checked1 === true) {
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
          callback(docs);
        }
      }
    );
  } else if (sf.checked2 === true) {
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
          callback(docs);
        }
      }
    );
  }
};

const insert = (factor, callback) => {
  objectCreator.createFactor(factor, (newFactor) => {
    db.insert(newFactor, function () {
      if (typeof callback === "function") {
        callback();
      }
    });
  });
};

const update = (id, factor, callback) => {
  calcSumFactor.calculate(factor.products, factor.pays, (calcs) => {
    factor.calcs = calcs;
    db.update({ _id: id }, { 
      docType: factor.docType,
      owner: factor.owner,
      ownerName: factor.ownerName,
      customeId: factor.customeId,
      isPayed: factor.isPayed, 
      factorDate: factor.factorDate,
      changeDate: factor.changeDate,
      products: factor.products,
      calcs: factor.calcs,
      pays: factor.pays,
     }, {}, function () {
      if (typeof callback === "function") {
        callback();
      }
    });
  });
};

module.exports = {
  getAll,
  getOne,
  insert,
  update,
  factorsWithProduct,
  SearchFactors,
};
