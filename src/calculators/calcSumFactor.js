const calculate = (products, callback) => {
  if(!products) return;
  let calcs = {
    fullSum: 0,
    sums: []
  }
  let tmp;
  for(let i = 0; i < products.length; i++){
    tmp = products[i].weight * products[i].price;
    calcs.sums.push(tmp);
    calcs.fullSum += tmp;
  }
  if (typeof callback === "function") {
    callback(calcs);
  }
}

module.exports = {
  calculate,
}