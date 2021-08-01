const calculate = (products, pays, callback) => {
  if(!products) return;
  let calcs = {
    fullSum: 0,
    sums: [],
    fullSumPays: 0,
  }
  let tmp;
  for(let i = 0; i < products.length; i++){
    tmp = Math.round(100 * ( products[i].weight * products[i].price)) / 100;
    calcs.sums.push(tmp);
    calcs.fullSum += tmp;
  }
  if(pays && pays.length > 0){
    for(let i2 = 0; i2 < pays.length; i2++) {
      calcs.fullSumPays += pays[i2].amount;
    }
  }
  if (typeof callback === "function") {
    callback(calcs);
  }
}

module.exports = {
  calculate,
}
