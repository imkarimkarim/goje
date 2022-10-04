const { ipcMain } = require("electron");
const productDocs = require("../db/productDocs");
const carDocs = require("../db/carDocs");
const { validateCar } = require("../modules/validator");
const { createProductsBasedOnCar } = require("../modules/productCreator");

ipcMain.on("getOneCar", (event, id) => {
  carDocs.getOne(id, (docs) => {
    event.reply("getOneCar", docs);
  });
});

ipcMain.on("searchInCars", (event, searchFilters) => {
  carDocs.search(searchFilters, (docs) => {
    event.reply("searchInCars", docs);
  });
});

// TODO: refactor
ipcMain.on("includeCar", (event, car) => {
  validateCar(car, (status, message) => {
    if (status === true) {
      carDocs.insert(car, (newCar) => {
        createProductsBasedOnCar(newCar, newCar.customeId, (products) => {
          // inserting each product based on
          // objects created by createProductsBasedOnCar
          for (let i = 0; i < products.length; i++) {
            (function (ind) {
              setTimeout(function () {
                productDocs.insert(products[ind], (newProduct) => {
                  // saving product customeId for later use cases on car object
                  newCar.products[ind].customeId = newProduct.customeId;
                  if (i === products.length - 1) {
                    carDocs.update(newCar._id, newCar, () => {
                      event.reply("includeCar", {
                        status: status,
                        message: "بار با موفقیت وارد شد",
                      });
                    });
                  }
                });
              }, 100 + 600 * ind);
            })(i);
          }
        });
      });
    }
    if (status === false) {
      event.reply("includeCar", { status: status, message: message });
    }
  });
});

ipcMain.on("editCar", (event, car) => {
  validateCar(car, (status, message) => {
    if (status === true) {
      createProductsBasedOnCar(car, car.customeId, (products) => {
        for (let i = 0; i < products.length; i++) {
          (function (ind) {
            setTimeout(function () {
              if (
                car.products[ind].customeId &&
                car.products[ind].customeId.length > 3
              ) {
                productDocs.updateCarProduct(
                  car.products[ind].customeId,
                  products[ind],
                  () => {
                    if (i === products.length - 1) {
                      carDocs.update(car._id, car, () => {
                        event.reply("editCar", {
                          status: status,
                          message: "بار با موفقیت ویرایش شد",
                        });
                      });
                    }
                  }
                );
              } else {
                productDocs.insert(products[ind], (newProduct) => {
                  car.products[ind].customeId = newProduct.customeId;
                  if (i === products.length - 1) {
                    carDocs.update(car._id, car, () => {
                      event.reply("editCar", {
                        status: status,
                        message: "بار با موفقیت ویرایش شد",
                      });
                    });
                  }
                });
              }
            }, 100 + 400 * ind);
          })(i);
        }
      });
    }
    if (status === false) {
      event.reply("includeCar", { status: status, message: message });
    }
  });
});

ipcMain.on("toggleCarFinish", (event, id) => {
  carDocs.toggleCarFinish(id);
});
