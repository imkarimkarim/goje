const { ipcMain } = require("electron");
const productDocs = require("../db/productDocs");
const calcOneProduct = require("../calculators/calcOneProduct");
const { isProductValid } = require("../modules/validator");

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
  if (isProductValid(product)) {
    productDocs.insert(product, () => {
      event.reply("includeProduct", true);
    });
  } else {
    event.reply("includeProduct", false);
  }
});

ipcMain.on('editProduct', (event, product) => {
  if(isProductValid(product)) {
    productDocs.update(product._id, product, () =>{
      event.reply('editProduct', true);
    })
  } else {
    event.reply('editProduct', false);
  }
})
