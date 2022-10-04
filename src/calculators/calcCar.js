const calculate = (car, productsSales, callback) => {
  let fullSum, sumSaleCommission;

  fullSum = 0;
  for (let i = 0; i < productsSales.length; i++) {
    fullSum += productsSales[i].FULL_SALE;
  }
  // 0.01 for getting % (shortcut of Proportionality)
  sumSaleCommission = Math.floor(fullSum * (car.commission * 0.01));

  const ownerEarnings =
    fullSum - (sumSaleCommission + car.portage + car.unload + car.cash);

  if (typeof callback === "function") {
    callback(ownerEarnings);
  }
};

module.exports = {
  calculate,
};
