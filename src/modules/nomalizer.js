const productNormalize = (product) => {
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

module.exports ={
  productNormalize,
}