const { db } = require("../db");
const objectCreator = require("../modules/objectCreator");

const getAll = (callback) => {
  db.find({ docType: "productOwner" }, (err, docs) => {
    if (err) throw err;
    if (typeof callback === "function") {
      callback(docs);
    }
  });
};

const getOne = (id, callback) => {
  if(!id) return;
  db.findOne({ docType: "productOwner", customeId: id }, (err, doc) => {
    if (err) throw err;
    if (typeof callback === "function") {
      callback(doc);
    }
  });
};

const isProductOwnerExists = (name, callback) => {
  db.find(
    { docType: "productOwner", name: name },
    (err, docs) => {
      if (err) throw err;
      if (typeof callback === "function") {
        callback(docs);
      }
    }
  );
};

const insert = (owner, callback) => {
  objectCreator.createProductOwner(owner, (obj) => {
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
  getOne
};
