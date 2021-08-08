const { ipcMain } = require("electron");
const productDocs = require("../db/productDocs");
const carDocs = require("../db/carDocs");
const { validateCar } = require("../modules/validator");
const { createProductsBasedOnCar } = require("../modules/productCreator");

ipcMain.on("includeCar", (event, car) => {
  validateCar(car, (status, message) => {
    if (status === true) {
      carDocs.insert(car, () => {
        createProductsBasedOnCar(car, (products) => {
          for (let i = 0; i < products.length; i++) {
            productDocs.insert(products[i], () => {
              if (i === products.length - 1) {
                event.reply("includeCar", {
                  status: status,
                  message: "بار با موفقیت وارد شد",
                });
              }
            });
          }
        });
      });
    }
    if (status === false) {
      event.reply("includeCar", { status: status, message: message });
    }
  });
});
