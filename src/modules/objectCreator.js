const {generateNewCustomId} = require('./idGenerator');

const createCustomer = (name, callback) => {
  generateNewCustomId((id) => {
    let newCustomer = {
      docType: 'customer',
      customeId: null,
      name: '',
    }
    newCustomer.name = name;
    newCustomer.customeId = id;
    if (typeof callback === "function") {
      callback(newCustomer);
    }
  })
}

const createProduct = (product, callback) => {
  generateNewCustomId((id) => {
    let newProduct = {
      docType: 'product',
      customeId: null,
      productName: '',
      owner: '',
      basculeWeight: 0,
      amount: 0,
      arrivalDate: 0,
      finishDate: false,
      isProductFinish: false,
      commission: 0,
      unload: 0,
      portage: 0,
      cash: 0,
      driverInfo: {
        name: '',
        plaque: '',
        car: '',
      }
    }
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
    newProduct.driverInfo = product.driverInfo;
    if (typeof callback === "function") {
      callback(newProduct);
    }
  })
}

const createFactor = (factor, callback) => {
  generateNewCustomId((id) => {
    let newFactor = {
      docType: 'factor',
      owner: '',
      customeId: null,
      isPayed: false,
      factorDate: null,
      changeDate : null,
      products : []  
    }
    
    newFactor.owner = factor.owner;
    newFactor.customeId = id;
    newFactor.isPayed = factor.isPayed;
    newFactor.factorDate = factor.factorDate;
    newFactor.changeDate = factor.changeDate;
    newFactor.products = factor.products;
    if (typeof callback === "function") {
      callback(newFactor);
    }
  })
}

module.exports = {
  createCustomer, createProduct, createFactor
}