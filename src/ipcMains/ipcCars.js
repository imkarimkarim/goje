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

ipcMain.on("includeCar", (event, car) => {
  validateCar(car, (status, message) => {
    if (status === true) {
      carDocs.insert(car, (carId) => {
        createProductsBasedOnCar(car, carId, (products) => {
          for (let i = 0; i < products.length; i++) {
            (function (ind) {
              setTimeout(function () {
                productDocs.insert(products[i], () => {
                  if (i === products.length - 1) {
                    event.reply("includeCar", {
                      status: status,
                      message: "بار با موفقیت وارد شد",
                    });
                  }
                });
              }, 100 + 100 * ind);
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
