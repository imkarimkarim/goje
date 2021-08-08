const { ipcMain } = require("electron");
const productDocs = require("../db/productDocs");
const calcOneProduct = require("../calculators/calcOneProduct");
const { validateProduct, validateCar } = require("../modules/validator");

ipcMain.on("getUnFinishedProducts", (event) => {
  productDocs.getUnFinished((docs) => {
    event.reply("getUnFinishedProducts", docs);
  });
});

ipcMain.on("searchInProducts", (event, searchFilters) => {
  productDocs.search(searchFilters, (docs) => {
    event.reply("searchInProducts", docs);
  });
});

ipcMain.on("getOneProduct", (event, id) => {
  productDocs.getOne(id, (docs) => {
    event.reply("getOneProduct", docs);
  });
});

ipcMain.on("getOneProductCalcs", (event, id) => {
  calcOneProduct.calculate(id, (results) => {
    event.reply("oneProductCalcs", results);
  });
});

ipcMain.on("includeProduct", (event, product) => {
  validateProduct(product, (status, message) => {
    if (status === true) {
      productDocs.insert(product, () => {
        event.reply("includeProduct", {
          status: status,
          message: "بار با موفقیت وارد شد",
        });
      });
    }
    if (status === false) {
      event.reply("includeProduct", { status: status, message: message });
    }
  });
});

ipcMain.on("includeCar", (event, car) => {
  validateCar(car, (status, message) => {
    if (status === true) {
        event.reply("includeCar", {
          status: status,
          message: "بار با موفقیت وارد شد",
        });
    }
    if (status === false) {
      event.reply("includeCar", { status: status, message: message });
    }
  });
});

ipcMain.on("editProduct", (event, product) => {
  // if (validateProduct(product)) {
  //   productDocs.update(product._id, product, () => {
  //     event.reply("editProduct", true);
  //   });
  // } else {
  //   event.reply("editProduct", false);
  // }
  validateProduct(product, (status, message) => {
    if (status === true) {
      productDocs.update(product._id, product, () => {
        event.reply("editProduct", {
          status: status,
          message: "ویرایش با موفقیت انجام شد",
        });
      });
    }
    if (status === false) {
      event.reply("editProduct", { status: status, message: message });
    }
  });
});
