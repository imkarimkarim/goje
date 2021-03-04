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

const isCustomerExists = (name, address, callback) => {
  db.find(
    { docType: "customer", name: name, address: address },
    (err, docs) => {
      if (err) throw err;
      if (typeof callback === "function") {
        callback(docs);
      }
    }
  );
};

const insert = (name, address, callback) => {
  objectCreator.createCustomer(name, address, (obj) => {
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
};
