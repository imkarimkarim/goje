const factorDocs = require('../db/factorDocs');
const productDocs = require('../db/productDocs');
let RESULTS = {
  SALE_AVERAGE: 0,
  SUM_KG: 0,
  SUM_AMOUNT: 0,
  COMMISSION: 0,
  FULL_SALE: 0,
  OWNER_ERNINGS: 0,
  productData: {}
};

let productData = {
  KG: 0,
  Amount: 0,
  ID: 0 ,
  unload: 0,
  portage: 0,
  cash: 0,
  commission: 0,
}

let factorsDatas = ['amount', 'kg', 'price'];

function getNeededData(productId, callback) {
  let data = {};
  factorDocs.withProduct(productId, (docs) => {
    data.factors = docs;
    productDocs.getOne(productId, (docs) => {
      data.product = docs;
      if (typeof callback === "function") {
        callback(data);
      }
    })
  })
}

function extractDataFromFactor(factor){
  if(!factor) return;
  let products = factor.products;
  for(let i = 0; i < products.length; i++) {
    let p = products[i];
    if(p.productId === productData.ID)
    factorsDatas.push([p.amount, p.weight, p.price]);
  }
}

function extractDataFromProduct(product){
  if(!product) return;
  productData.Amount = product.amount;
  productData.KG = product.basculeWeight;
  productData.commission = product.commission;
  productData.unload = product.unload;
  productData.portage = product.portage;
  productData.cash = product.cash;
}

function extractData(data, callback){
  factorsDatas = [];
  let factors = data.factors;
  let product = data.product;
  for(let i = 0; i < factors.length; i++) {
    extractDataFromFactor(factors[i]);
  }
  extractDataFromProduct(product);
  if (typeof callback === "function") {
    callback(data);
  }
}

function calculateAllTheStuffFinally(callback) {
  RESULTS = {
    SALE_AVERAGE: 0,
    SUM_KG: 0,
    SUM_AMOUNT: 0,
    COMMISSION: 0,
    FULL_SALE: 0,
    OWNER_ERNINGS: 0,
    productData: {}
  };
  factorsDatas.forEach((product) => {
    RESULTS.SUM_KG += product[1];
    RESULTS.SUM_AMOUNT += product[0];
    RESULTS.FULL_SALE += (product[1] * product[2]);
  });
  RESULTS.SUM_KG =  Math.round(100 * ( RESULTS.SUM_KG )) / 100;
  RESULTS.SALE_AVERAGE = Math.floor(RESULTS.FULL_SALE / RESULTS.SUM_KG);
  RESULTS.FULL_SALE = Math.floor(RESULTS.SUM_KG * RESULTS.SALE_AVERAGE);
  RESULTS.COMMISSION = Math.floor((RESULTS.SUM_KG * RESULTS.SALE_AVERAGE) * (productData.commission * .01));
  RESULTS.OWNER_ERNINGS = Math.floor(RESULTS.FULL_SALE - productData.portage - productData.unload - RESULTS.COMMISSION - productData.cash);
  RESULTS.productData = productData;

  if(isNaN(RESULTS.SALE_AVERAGE)) RESULTS.SALE_AVERAGE = 0;
  if(isNaN(RESULTS.FULL_SALE)) RESULTS.FULL_SALE = 0;
  if(isNaN(RESULTS.COMMISSION)) RESULTS.COMMISSION = 0;
  if(isNaN(RESULTS.OWNER_ERNINGS)) RESULTS.OWNER_ERNINGS = 0;

  if (typeof callback === "function") {
    callback(RESULTS);
  }
}

const calculate = (id, callback) => {
  if(!id) return;
  productData.ID = id;
  getNeededData(id, (data) => {
    extractData(data, () => {
      calculateAllTheStuffFinally(() => {
        if (typeof callback === "function") {
          callback(RESULTS);
        }
      })
    })
  })
}


module.exports = {
  calculate
}
