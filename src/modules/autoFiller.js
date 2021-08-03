const { generateNewCustomId } = require("./idGenerator");
const calcSumFactor = require("../calculators/calcSumFactor");
const { customerSchema } = require("../schemas.js");
const { productOwnerSchema } = require("../schemas.js");
const { productSchema } = require("../schemas.js");
const { factorSchema } = require("../schemas.js");

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
    factor.customeId = id;
    factor.docType = factorSchema.autoInput.docType.defaultValue;;
    calcSumFactor.calculate(factor.products, factor.pays, (calcs) => {
      factor.calcs = calcs;
    });

    if (typeof callback === "function") {
      callback(factor);
    }
  });
};

module.exports = {
  autoFillCustomerAutoInputs,
  autoFillProductOwnerAutoInputs,
  autoFillProductAutoInputs,
  createFactor,
};
