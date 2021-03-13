const { generateNewCustomId } = require("./idGenerator");
const calcSumFactor = require("../calculators/calcSumFactor");

const createCustomer = (name, callback) => {
  generateNewCustomId((id) => {
    let newCustomer = {
      docType: "customer",
      customeId: null,
      name: "",
    };
    newCustomer.name = name;
    newCustomer.customeId = id;
    if (typeof callback === "function") {
      callback(newCustomer);
    }
  });
};

const createProduct = (product, callback) => {
  generateNewCustomId((id) => {
    let newProduct = {
      docType: "product",
      customeId: null,
      productName: "",
      owner: "",
      basculeWeight: 0,
      amount: 0,
      arrivalDate: 0,
      finishDate: false,
      isProductFinish: false,
      commission: 0,
      unload: 0,
      portage: 0,
      cash: 0,
      plaque: "",
    };
    newProduct.customeId = id;
    newProduct.productName = product.productName;
    newProduct.owner = product.owner;
    newProduct.basculeWeight = product.basculeWeight;
    newProduct.amount = product.amount;
    newProduct.arrivalDate = product.arrivalDate;
    newProduct.commission = product.commission;
    newProduct.unload = product.unload;
    newProduct.portage = product.portage;
    newProduct.cash = product.cash;
    newProduct.plaque = product.plaque;
    if (typeof callback === "function") {
      callback(newProduct);
    }
  });
};

const createFactor = (factor, callback) => {
  generateNewCustomId((id) => {
    let newFactor = {
      docType: "factor",
      owner: "",
      ownerName: "",
      customeId: null,
      isPayed: false,
      factorDate: null,
      changeDate: null,
      products: [],
      calcs: {
        fullSum: 0,
        sums: [],
      },
      pays: [
        {
          date: 0,
          amount: 0,
        },
      ],
    };

    newFactor.owner = factor.owner;
    newFactor.ownerName = factor.ownerName;
    newFactor.customeId = id;
    newFactor.isPayed = factor.isPayed;
    newFactor.factorDate = factor.factorDate;
    newFactor.changeDate = factor.changeDate;
    newFactor.products = factor.products;
    calcSumFactor.calculate(newFactor.products, (calcs) => {
      newFactor.calcs = calcs;
    });
    newFactor.pays = factor.pays;

    if (typeof callback === "function") {
      callback(newFactor);
    }
  });
};

module.exports = {
  createCustomer,
  createProduct,
  createFactor,
};
