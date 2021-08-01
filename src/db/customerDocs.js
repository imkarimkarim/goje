const { db } = require("../db");
const objectCreator = require("../modules/objectCreator");

const getAll = (callback) => {
  db.find({ docType: "customer" }, (err, docs) => {
    if (err) throw err;
    if (typeof callback === "function") {
      callback(docs);
    }
  });
};

// const getOne = (customer, callback) => {
//   if(!customer.id) return;
//   db.findOne({ docType: "customer", customeId: customer.id }, (err, doc) => {
//     if (err) throw err;
//     if (typeof callback === "function") {
//       callback(doc);
//     }
//   });
// };

const isCustomerExists = (customer, callback) => {
  db.find({ docType: "customer", name: customer.name }, (err, docs) => {
    if (err) throw err;
    if (typeof callback === "function") {
      callback(docs);
    }
  });
};

const insert = (customer, callback) => {
  objectCreator.autoFillCustomerAutoInputs(customer, (obj) => {
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
  isCustomerExists,
  // getOne
};
