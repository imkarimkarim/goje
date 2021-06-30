const normalizeProduct = (product) => {
  if(!product) return;
  let nProduct;
  nProduct = {};
  nProduct = product;
  nProduct.basculeWeight =  parseInt(product.basculeWeight);
  nProduct.amount = parseInt(product.amount);
  nProduct.arrivalDate = parseInt(product.arrivalDate);
  nProduct.finishDate = parseInt(product.finishDate);
  nProduct.commission = parseInt(product.commission);
  nProduct.unload = parseInt(product.unload);
  nProduct.portage = parseInt(product.portage);
  nProduct.cash = parseInt(product.cash);

  return nProduct;
}

const normalizeProductOwner = (productOwner) => {
  if(!productOwner) return;
  let nProductOwner;
  nProductOwner = {};
  nProductOwner = productOwner;
  nProductOwner.defaultCommission = parseInt(productOwner.defaultCommission);

  return nProductOwner;
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
    nFactor.products[i].weight = parseFloat(factor.products[i].weight);
    nFactor.products[i].price = parseInt(factor.products[i].price);
  }
  for(let i2 = 0; i2 < nFactor.pays.length; i2++) {
    nFactor.pays[i2].amount = parseInt(factor.pays[i2].amount);
  }

  return nFactor;
}

module.exports ={
  normalizeProduct, normalizeFactor, normalizeProductOwner
}
