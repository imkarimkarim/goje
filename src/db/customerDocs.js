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

const getOne = (id, callback) => {
  if(!id) return;
  db.findOne({ docType: "customer", customeId: id }, (err, doc) => {
    if (err) throw err;
    if (typeof callback === "function") {
      callback(doc);
    }
  });
};

const isCustomerExists = (name, callback) => {
  db.find(
    { docType: "customer", name: name },
    (err, docs) => {
      if (err) throw err;
      if (typeof callback === "function") {
        callback(docs);
      }
    }
  );
};

const insert = (name, callback) => {
  objectCreator.createCustomer(name, (obj) => {
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
  getOne
};
