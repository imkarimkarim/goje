const { db } = require("../db");
const autoFiller = require("../modules/autoFiller");

const getAll = (callback) => {
  db.find({ docType: "productOwner" }, (err, docs) => {
    if (err) throw err;
    if (typeof callback === "function") {
      callback(docs);
    }
  });
};

// const getOne = (id, callback) => {
//   if(!id) return;
//   db.findOne({ docType: "productOwner", customeId: id }, (err, doc) => {
//     if (err) throw err;
//     if (typeof callback === "function") {
//       callback(doc);
//     }
//   });
// };

const isProductOwnerExists = (productOwner, callback) => {
  db.find(
    { docType: "productOwner", name: productOwner.name },
    (err, docs) => {
      if (err) throw err;
      if (typeof callback === "function") {
        callback(docs);
      }
    }
  );
};

const insert = (productOwner, callback) => {
  autoFiller.autoFillProductOwnerAutoInputs(productOwner, (obj) => {
    db.insert(obj, function () {
      if (typeof callback === "function") {
        callback();
      }
    });
  });
};

module.exports = {
  getAll,
  insert,
  isProductOwnerExists,
  // getOne
};
