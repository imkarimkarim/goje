const { db } = require("../db");
const autoFiller = require("../modules/autoFiller");

const sortProductsArray = (producs) => {
  if (!producs) return;
  producs
    .sort((a, b) => {
      return a.arrivalDate - b.arrivalDate;
    })
    .reverse();
  return producs;
};

const getAll = (callback) => {
  db.find({ docType: "product" }, (err, docs) => {
    if (err) throw err;
    if (typeof callback === "function") {
      if (docs) {
        docs = sortProductsArray(docs);
        callback(docs);
      }
    }
  });
};

const getUnFinished = (callback) => {
  db.find(
    { $and: [{ docType: "product" }, { isProductFinish: false }] },
    function (err, docs) {
      if (err) throw err;
      if (typeof callback === "function") {
        if (docs) {
          docs = sortProductsArray(docs);
          callback(docs);
        }
      }
    }
  );
};

const isProductHasDependency = (id, callback) => {
  if (!id) return;
  db.find({ "products.productId": id }, (err, docs) => {
    if (err) throw err;
    if (typeof callback === "function") {
      if (docs.length > 0) {
        callback(true);
      } else {
        callback(false);
      }
    }
  });
};

const getInCar = (carId, callback) => {
  db.find(
    { $and: [{ docType: "product" }, { inCar: carId }] },
    function (err, docs) {
      if (err) throw err;
      if (typeof callback === "function") {
        if (docs) {
          docs = sortProductsArray(docs);
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
          { docType: "product" },
          { arrivalDate: { $gte: sf.fromm } },
          { arrivalDate: { $lte: sf.till } },
        ],
      },
      function (err, docs) {
        if (err) throw err;
        if (typeof callback === "function") {
          if (docs) {
            docs = sortProductsArray(docs);
            callback(docs);
          }
        }
      }
    );
  } else if (sf.checked1 === true) {
    db.find(
      {
        $and: [
          { docType: "product" },
          { isProductFinish: false },
          { arrivalDate: { $gte: sf.fromm } },
          { arrivalDate: { $lte: sf.till } },
        ],
      },
      function (err, docs) {
        if (err) throw err;
        if (typeof callback === "function") {
          if (docs) {
            docs = sortProductsArray(docs);
            callback(docs);
          }
        }
      }
    );
  } else if (sf.checked2 === true) {
    db.find(
      {
        $and: [
          { docType: "product" },
          { isProductFinish: true },
          { arrivalDate: { $gte: sf.fromm } },
          { arrivalDate: { $lte: sf.till } },
        ],
      },
      function (err, docs) {
        if (err) throw err;
        if (typeof callback === "function") {
          if (docs) {
            docs = sortProductsArray(docs);
            callback(docs);
          }
        }
      }
    );
  }
};

const getFinished = (callback) => {
  db.find(
    { $and: [{ docType: "product" }, { isProductFinish: true }] },
    function (err, docs) {
      if (err) throw err;
      if (typeof callback === "function") {
        if (docs) {
          docs = sortProductsArray(docs);
          callback(docs);
        }
      }
    }
  );
};

const getOne = (id, callback) => {
  if (!id) return;
  db.findOne(
    { $and: [{ docType: "product" }, { customeId: id }] },
    function (err, doc) {
      if (err) throw err;
      if (typeof callback === "function") {
        callback(doc);
      }
    }
  );
};

const insert = (product, callback) => {
  autoFiller.autoFillProductAutoInputs(product, (obj) => {
    db.insert(obj, function (err, newDoc) {
      if (err) throw err;
      if (typeof callback === "function") {
        callback(newDoc);
      }
    });
  });
};

const toggleProductFinish = (id, callback) => {
  if (!id) return;
  db.findOne({ _id: id }, function (err, doc) {
    if (err) throw err;
    doc.finishDate = doc.isProductFinish ? false : Date.now();
    doc.isProductFinish = doc.isProductFinish ? false : true;
    db.update(
      { _id: id },
      {
        ...doc,
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

const isProductBug = (productId, carId, callback) => {
  if (!productId || !carId) return;
  db.findOne(
    { $and: [{ docType: "car" }, { customeId: carId }] },
    function (err, car) {
      if (err) throw err;

      const isInCarProducts = car.products.filter(
        (p) => p.customeId === productId
      );
      const bool = isInCarProducts.length === 1 ? false : true;

      if (typeof callback === "function") {
        callback(bool);
      }
    }
  );
};

const addCheat = (productId, cheat, callback) => {
  if (!productId) return;
  db.findOne(
    { $and: [{ docType: "product" }, { customeId: productId }] },
    function (err, doc) {
      if (err) throw err;
      doc.cheat = {
        amount: cheat.amount,
        weight: cheat.weight,
        price: cheat.price,
      };
      db.update(
        { _id: doc._id },
        {
          ...doc,
        },
        {},
        function () {
          if (typeof callback === "function") {
            callback();
          }
        }
      );
    }
  );
};

const removeCheat = (productId, callback) => {
  if (!productId) return;
  db.findOne(
    { $and: [{ docType: "product" }, { customeId: productId }] },
    function (err, doc) {
      if (err) throw err;
      doc.cheat = {
        amount: false,
        weight: false,
        price: false,
      };
      db.update(
        { _id: doc._id },
        {
          ...doc,
        },
        {},
        function () {
          if (typeof callback === "function") {
            callback();
          }
        }
      );
    }
  );
};

const update = (id, product, callback) => {
  db.update(
    { _id: id },
    {
      ...product,
    },
    {},
    function () {
      if (typeof callback === "function") {
        callback();
      }
    }
  );
};

const updateCarProduct = (productId, product, callback) => {
  db.findOne(
    { $and: [{ docType: "product" }, { customeId: productId }] },
    function (err, doc) {
      if (err) throw err;
      db.update(
        { _id: doc._id },
        {
          ...product,
          docType: doc.docType,
          customeId: doc.customeId,
          isProductFinish: doc.isProductFinish,
          finishDate: doc.finishDate,
          ...doc,
        },
        {},
        function () {
          if (typeof callback === "function") {
            callback();
          }
        }
      );
    }
  );
};

const remove = (id, callback) => {
  db.remove(
    { $and: [{ docType: "product" }, { customeId: id }] },
    {},
    function (err, numRemoved) {
      if (typeof callback === "function") {
        callback(numRemoved);
      }
    }
  );
};

const removeById = (id) => {
  db.remove({ _id: id }, {}, function (err, numRemoved) {});
};

module.exports = {
  getAll,
  insert,
  update,
  updateCarProduct,
  remove,
  removeById,
  getUnFinished,
  getInCar,
  getFinished,
  getOne,
  search,
  toggleProductFinish,
  isProductBug,
  isProductHasDependency,
  addCheat,
  removeCheat,
};
