const createProductsBasedOnCar = (car, carId, callback) => {
  let products = [];
  for (let i = 0; i < car.products.length; i++) {
    const basculeWeight =
      car.products[i].weight === "" ? 0 : car.products[i].weight;
    const amount = car.products[i].amount === "" ? 0 : car.products[i].amount;
    const price = car.products[i].price === "" ? 0 : car.products[i].price;
    products.push({
      productName: car.products[i].productName,
      owner: car.owner,
      ownerId: car.ownerId,
      basculeWeight: basculeWeight,
      amount: amount,
      arrivalDate: car.arrivalDate,
      finishDate: false,
      isProductFinish: false,
      commission: car.commission,
      unload: 0,
      portage: 0,
      cash: 0,
      plaque: car.plaque,
      ps: "",
      inCar: carId,
    });
  }
  if (typeof callback === "function") {
    callback(products);
  }
};

module.exports = {
  createProductsBasedOnCar,
};
