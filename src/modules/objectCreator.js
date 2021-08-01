const { generateNewCustomId } = require("./idGenerator");
const calcSumFactor = require("../calculators/calcSumFactor");
const { customerSchema } = require("../schemas.js");
const { productOwnerSchema } = require("../schemas.js");
const { productSchema } = require("../schemas.js");

const autoFillCustomerAutoInputs = (customer, callback) => {
  generateNewCustomId((id) => {
    customer.docType = customerSchema.autoInput.docType.defaultValue;
    customer.customeId = id;
    if (typeof callback === "function") {
      callback(customer);
    }
  });
};

const autoFillProductOwnerAutoInputs = (productOwner, callback) => {
  generateNewCustomId((id) => {
    productOwner.customeId = id;
    productOwner.docType = productOwnerSchema.autoInput.docType.defaultValue;
    if (typeof callback === "function") {
      callback(productOwner);
    }
  });
};

const autoFillProductAutoInputs = (product, callback) => {
  generateNewCustomId((id) => {
    product.customeId = id;
    product.docType = productSchema.autoInput.docType.defaultValue;
    if (typeof callback === "function") {
      callback(product);
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
    newFactor.pays = factor.pays;
    calcSumFactor.calculate(newFactor.products, newFactor.pays, (calcs) => {
      newFactor.calcs = calcs;
    });

    if (typeof callback === "function") {
      callback(newFactor);
    }
  });
};

module.exports = {
  autoFillCustomerAutoInputs,
  autoFillProductOwnerAutoInputs,
  autoFillProductAutoInputs,
  createFactor,
};
