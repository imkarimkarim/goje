const { ipcMain } = require("electron");
const productDocs = require("../db/productDocs");
const calcOneProduct = require("../calculators/calcOneProduct");
const { validateProduct, validateCheat } = require("../modules/validator");

ipcMain.on("getUnFinishedProducts", (event) => {
  productDocs.getUnFinished((docs) => {
    event.reply("getUnFinishedProducts", docs);
  });
});

ipcMain.on("getInCarProducts", (event, carId) => {
  productDocs.getInCar(carId, (docs) => {
    event.reply("getInCarProducts", docs);
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

ipcMain.on("isProductHasDependency", (event, productId) => {
  productDocs.isProductHasDependency(productId, (status) => {
    if (status === true) {
      event.reply("isProductHasDependency", {
        status: status,
        message:
          "امکان حذف وجود ندارد. این بار دارای وابستگی میباشد(به ریز فروش بار مربوطه مراجعه کنید)",
      });
    }
    if (status === false) {
      event.reply("isProductHasDependency", {
        status: status,
        productId: productId,
      });
    }
  });
});

ipcMain.on("toggleProductFinish", (event, id) => {
  productDocs.toggleProductFinish(id);
});

ipcMain.on("editProduct", (event, product) => {
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

ipcMain.on("cheatProduct", (event, cheat) => {
  validateCheat(cheat.cheat, (status, message) => {
    if (status === true) {
      productDocs.addCheat(cheat.productId, cheat.cheat, () => {
        event.reply("cheatProduct", {
          status: status,
          message: "با موفقیت انجام شد",
        });
      });
    }
    if (status === false) {
      event.reply("cheatProduct", { status: status, message: message });
    }
  });
});

ipcMain.on("removeCheatProduct", (event, productId) => {
  productDocs.removeCheat(productId, () => {
    event.reply("removeCheatProduct", {
      status: true,
      message: "با موفقیت انجام شد",
    });
  });
});

ipcMain.on("removeProduct", (event, productId) => {
  productDocs.remove(productId, (numRemoved) => {
    if (numRemoved === 0) {
      event.reply("removeProduct", {
        status: true,
        message: "بار با موفقیت حذف شد",
      });
    } else if (numRemoved === 0) {
      event.reply("removeProduct", { status: false, message: "بار حذف نشد" });
    }
  });
});
