const { db } = require("../db");
const autoFiller = require("../modules/autoFiller");

// TODO: cleanCode -> seperate file for sorts functions
// TODO: cleanCode -> error handling function

const sortCarArray = (cars) => {
  if (!cars) return;
  cars
    .sort((a, b) => {
      return a.arrivalDate - b.arrivalDate;
    })
    .reverse();
  return cars;
};

const getAll = (callback) => {
  db.find({ docType: "productOwner" }, (err, docs) => {
    if (err) throw err;
    if (typeof callback === "function") {
      callback(docs);
    }
  });
};

const toggleHideInOwnersInput = (ownerId, callback) => {
    db.findOne({ $and: [{ docType: "productOwner" }, { customeId: ownerId }] }, function (err, doc) {
        if (err) throw err;
        let hide = doc.hideInOwnersInput;
        if (hide === undefined || hide === false) {
            hide = true;
        } else {
            hide = false;
        }
        db.update(
            { _id: doc._id },
            {
                ...doc,
                hideInOwnersInput: hide,
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

const getOne = (id, callback) => {
    if (!id) return;
    db.find(
        {
            $and: [{ docType: "productOwner" }, { customeId: id }],
        },
        function (err, docs) {
            if (err) throw err;
            if (typeof callback === "function") {
                callback(docs[0]);
            }
        }
    );
};

const isProductOwnerExists = (productOwner, callback) => {
    db.find({ docType: "productOwner", name: productOwner.name }, (err, docs) => {
        if (err) throw err;
        if (typeof callback === "function") {
            callback(docs);
        }
    });
};

const search = (id, callback) => {
    if (!id) return;
    db.find(
        {
            $and: [{ docType: "car" }, { ownerId: id }],
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
    toggleHideInOwnersInput,
    getOne,
    search,
    insert,
    isProductOwnerExists,
};
