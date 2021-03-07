const isProductValid = (product) => {
  let pass = true;
  
  const strings = [ "productName", "owner" ];
  for(let i = 0; i < strings.length; i++) {
    if(typeof(product[strings[i]]) !== 'string' || product[strings[i]].length === 0) {
      pass = false;
      break;
    }
  }
  const integers = [ "basculeWeight", "amount", "arrivalDate", "commission", "unload", "portage", "cash" ];
  for(let i2 = 0; i2 < integers.length; i2++) {
    if(typeof(product[integers[i2]]) !== 'number' || isNaN(product[integers[i2]])) {
      pass = false;
      break;
    }
  }
  console.log('from validator', pass);
  return pass;
};

module.exports = {
  isProductValid
}