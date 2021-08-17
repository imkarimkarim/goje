const { db } = require("../db");
const autoFiller = require("../modules/autoFiller");

const sortCarArray = (cars) => {
  if (!cars) return;
  cars
    .sort((a, b) => {
      return a.arrivalDate - b.arrivalDate;
    })
    .reverse();
  return cars;
};

const search = (searchFilters, callback) => {
  if (!searchFilters) return;
  const sf = searchFilters;
  if (sf.checked1 === true && sf.checked2 === true) {
    db.find(
      {
        $and: [
          { docType: "car" },
          { arrivalDate: { $gte: sf.fromm } },
          { arrivalDate: { $lte: sf.till } },
        ],
      },
      function (err, docs) {
        if (err) throw err;
        if (typeof callback === "function") {
          if (docs) {
            docs = sortCarArray(docs);
            callback(docs);
          }
        }
      }
    );
  } else if (sf.checked1 === true) {
    db.find(
      {
        $and: [
          { docType: "car" },
          { isPrinted: false },
          { arrivalDate: { $gte: sf.fromm } },
          { arrivalDate: { $lte: sf.till } },
        ],
      },
      function (err, docs) {
        if (err) throw err;
        if (typeof callback === "function") {
          if (docs) {
            docs = sortCarArray(docs);
            callback(docs);
          }
        }
      }
    );
  } else if (sf.checked2 === true) {
    db.find(
      {
        $and: [
          { docType: "car" },
          { isPrinted: true },
          { arrivalDate: { $gte: sf.fromm } },
          { arrivalDate: { $lte: sf.till } },
        ],
      },
      function (err, docs) {
        if (err) throw err;
        if (typeof callback === "function") {
          if (docs) {
            docs = sortCarArray(docs);
            callback(docs);
          }
        }
      }
    );
  }
};

const getOne = (id, callback) => {
  if (!id) return;
  db.findOne({ customeId: id }, function (err, doc) {
    if (err) throw err;
    if (typeof callback === "function") {
      callback(doc);
    }
  });
};

const insert = (car, callback) => {
  autoFiller.autoFillCarAutoInputs(car, (obj) => {
    db.insert(obj, function (err, newDoc) {
      if (err) throw err;
      if (typeof callback === "function") {
        callback(newDoc);
      }
    });
  });
};

const toggleCarFinish = (id, callback) => {
  if (!id) return;
  db.findOne({ _id: id }, function (err, doc) {
    if (err) throw err;
    db.update(
      { _id: id },
      {
        ...doc,
        printDate: Date.now(),
        isPrinted: true,
      },
      {},
      function (err, numReplaced) {
        if (typeof callback === "function") {
          callback(err, numReplaced);
        }
      }
    );
  });
};

const update = (id, car, callback) => {
  db.update(
    { _id: id },
    {
      ...car,
    },
    {},
    function () {
      if (typeof callback === "function") {
        callback();
      }
    }
  );
};

module.exports = {
  getOne,
  search,
  insert,
  toggleCarFinish,
  update,
};
