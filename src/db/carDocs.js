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

// const getUnPrinted = (callback) => {
//   db.find(
//     { $and: [{ docType: "car" }, { isPrinted: false }] },
//     function (err, docs) {
//       if (err) throw err;
//       if (typeof callback === "function") {
//         if(docs) {
//           docs = sortCarArray(docs);
//           callback(docs);
//         }
//       }
//     }
//   );
// };

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

// const getFinished = (callback) => {
//   db.find(
//     { $and: [{ docType: "product" }, { isProductFinish: true }] },
//     function (err, docs) {
//       if (err) throw err;
//       if (typeof callback === "function") {
//         if(docs) {
//           docs = sortCarArray(docs);
//           callback(docs);
//         }
//       }
//     }
//   );
// };

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
        callback(newDoc.customeId);
      }
    });
  });
};

// const update = (id, product, callback) => {
//     db.update({ _id: id }, {
//       docType: product.docType ,
//       customeId: product.customeId ,
//       productName: product.productName ,
//       owner: product.owner ,
//       basculeWeight: product.basculeWeight,
//       amount: product.amount ,
//       arrivalDate: product.arrivalDate ,
//       finishDate: product.finishDate ,
//       isProductFinish: product.isProductFinish ,
//       commission: product.commission ,
//       unload: product.unload,
//       portage: product.portage,
//       cash: product.cash,
//       plaque: product.plaque,
//       ps: product.ps
//      }, {}, function () {
//       if (typeof callback === "function") {
//         callback();
//       }
//     });
// };

// update,
// getUnFinished,
// getFinished,
// getAll,

module.exports = {
  getOne,
  search,
  insert,
};
