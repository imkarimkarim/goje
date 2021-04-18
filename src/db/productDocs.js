const { db } = require("../db");
const objectCreator = require("../modules/objectCreator");

const sortProductsArray = (producs) => {
  if(!producs) return;
  producs.sort((a, b) => {
    return a.arrivalDate - b.arrivalDate;
  }).reverse();
  return producs;
}

const getAll = (callback) => {
  db.find({ docType: "product" }, (err, docs) => {
    if (err) throw err;
    if (typeof callback === "function") {
      if(docs) {
        docs = sortProductsArray(docs);
        callback(docs);
      }
    }
  });
};

const getUnFinishedProducts = (callback) => {
  db.find(
    { $and: [{ docType: "product" }, { isProductFinish: false }] },
    function (err, docs) {
      if (err) throw err;
      if (typeof callback === "function") {
        if(docs) {
          docs = sortProductsArray(docs);
          callback(docs);
        }
      }
    }
  );
};

const searchProducts = (searchFilters, callback) => {
  if (!searchFilters) return;
  const sf = searchFilters;
  if(sf.checked1 === true && sf.checked2 === true){
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
          if(docs) {
            docs = sortProductsArray(docs);
            callback(docs);
          }
        }
      }
    );
  }
  else if(sf.checked1 === true){
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
          if(docs) {
            docs = sortProductsArray(docs);
            callback(docs);
          }
        }
      }
    );
  }
  else if(sf.checked2 === true){
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
          if(docs) {
            docs = sortProductsArray(docs);
            callback(docs);
          }
        }
      }
    );
  }
};

const getFinishedProducts = (callback) => {
  db.find(
    { $and: [{ docType: "product" }, { isProductFinish: true }] },
    function (err, docs) {
      if (err) throw err;
      if (typeof callback === "function") {
        if(docs) {
          docs = sortProductsArray(docs);
          callback(docs);
        }
      }
    }
  );
};

const getOneProduct = (id, callback) => {
  if (!id) return;
  db.findOne({ customeId: id }, function (err, doc) {
    if (err) throw err;
    if (typeof callback === "function") {
      callback(doc);
    }
  });
};

const insert = (product, callback) => {
  objectCreator.createProduct(product, (obj) => {
    db.insert(obj, function (err) {
      if (err) throw err;
      if (typeof callback === "function") {
        callback();
      }
    });
  });
};

const update = (id, product, callback) => {
    db.update({ _id: id }, {
      docType: product.docType ,
      customeId: product.customeId ,
      productName: product.productName ,
      owner: product.owner ,
      basculeWeight: product.basculeWeight, 
      amount: product.amount ,
      arrivalDate: product.arrivalDate ,
      finishDate: product.finishDate ,
      isProductFinish: product.isProductFinish ,
      commission: product.commission ,
      unload: product.unload,
      portage: product.portage,
      cash: product.cash,
      plaque: product.plaque,
      ps: product.ps
     }, {}, function () {
      if (typeof callback === "function") {
        callback();
      }
    });
};

module.exports = {
  getAll,
  insert,
  update,
  getUnFinishedProducts,
  getFinishedProducts,
  getOneProduct,
  searchProducts,
};
