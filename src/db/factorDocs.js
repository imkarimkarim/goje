const { db } = require("../db");
const autoFiller = require("../modules/autoFiller");
const calcSumFactor = require("../calculators/calcSumFactor");

const sortFactorsArray = (factors, reverse = true) => {
  if (!factors) return;
  if (reverse) {
    factors
      .sort((a, b) => {
        return a.factorDate - b.factorDate;
      })
      .reverse();
  } else {
    factors.sort((a, b) => {
      return a.factorDate - b.factorDate;
    });
  }

  return factors;
};

const getAll = (callback) => {
  db.find({ docType: "factor" }, (err, docs) => {
    if (err) throw err;
    if (typeof callback === "function") {
      if (docs) {
        docs = sortFactorsArray(docs);
        callback(docs);
      }
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

const withProduct = (id, callback) => {
  if (!id) return;
  db.find({ "products.productId": id }, (err, docs) => {
    if (err) throw err;
    if (typeof callback === "function") {
      if (docs) {
        docs = sortFactorsArray(docs);
        callback(docs);
      }
    }
  });
};

const factorsWithFactordate = (fromm, till, callback) => {
  if (!fromm && !till) return;

  db.find(
    {
      $and: [
        { docType: "factor" },
        { factorDate: { $gte: fromm } },
        { factorDate: { $lte: till } },
        { isPayed: false },
      ],
    },
    function (err, docs) {
      if (err) throw err;
      if (typeof callback === "function") {
        if (docs) {
          docs = sortFactorsArray(docs, false);
          callback(docs);
        }
      }
    }
  );
};

const search = (searchFilters, callback) => {
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
          if (docs) {
            docs = sortFactorsArray(docs);
            callback(docs);
          }
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
          if (docs) {
            docs = sortFactorsArray(docs);
            callback(docs);
          }
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
          if (docs) {
            docs = sortFactorsArray(docs);
            callback(docs);
          }
        }
      }
    );
  }
};

const insert = (factor, callback) => {
  autoFiller.autoFillFactorAutoInputs(factor, (obj) => {
    db.insert(obj, function () {
      if (typeof callback === "function") {
        callback();
      }
    });
  });
};

const update = (id, factor, callback) => {
  calcSumFactor.calculate(factor.products, factor.pays, (calcs) => {
    factor.calcs = calcs;
    db.update(
      { _id: id },
      {
        ...factor,
      },
      {},
      function () {
        if (typeof callback === "function") {
          callback();
        }
      }
    );
  });
};

module.exports = {
  getAll,
  getOne,
  insert,
  update,
  withProduct,
  search,
  factorsWithFactordate,
};
