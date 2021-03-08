const normalizeProduct = (product) => {
  if(!product) return;
  let nProduct;
  nProduct = {};
  nProduct = product;
  nProduct.basculeWeight =  parseInt(product.basculeWeight);
  nProduct.amount = parseInt(product.amount);
  nProduct.arrivalDate = parseInt(product.arrivalDate);
  nProduct.commission = parseInt(product.commission);
  nProduct.unload = parseInt(product.unload);
  nProduct.portage = parseInt(product.portage);
  nProduct.cash = parseInt(product.cash);
  
  return nProduct;
}

const normalizeFactor = (factor) => {
  if(!factor) return;
  let nFactor;
  nFactor = {};
  nFactor = factor;
  nFactor.factorDate = parseInt(factor.factorDate);
  nFactor.changeDate = parseInt(factor.changeDate);
  for(let i = 0; i < nFactor.products.length; i++) {
    nFactor.products[i].amount = parseInt(factor.products[i].amount);
    nFactor.products[i].weight = parseInt(factor.products[i].weight);
    nFactor.products[i].price = parseInt(factor.products[i].price);
  }
  
  return nFactor;
}

module.exports ={
  normalizeProduct, normalizeFactor
}