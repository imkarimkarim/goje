const { db } = require("../db");
const autoFiller = require("../modules/autoFiller");

const getAll = (callback) => {
  db.find({ docType: "customer" }, (err, docs) => {
    if (err) throw err;
    if (typeof callback === "function") {
      callback(docs);
    }
  });
};

const toggleHideInCustomerInput = (customerId, callback) => {
    db.findOne({ $and: [{ docType: "customer" }, { customeId: customerId }] }, function (err, doc) {
        if (err) throw err;
        let hide = doc.hideInCustomerInput;
        if (hide === undefined || hide === false) {
            hide = true;
        } else {
            hide = false;
        }
        db.update(
            { _id: doc._id },
            {
                ...doc,
                hideInCustomerInput: hide,
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

const isCustomerExists = (customer, callback) => {
    db.find({ docType: "customer", name: customer.name }, (err, docs) => {
        if (err) throw err;
        if (typeof callback === "function") {
            callback(docs);
        }
    });
};

const insert = (customer, callback) => {
    autoFiller.autoFillCustomerAutoInputs(customer, (obj) => {
        db.insert(obj, function () {
            if (typeof callback === "function") {
                callback();
            }
        });
    });
};

module.exports = {
    getAll,
    toggleHideInCustomerInput,
    insert,
    isCustomerExists,
};
