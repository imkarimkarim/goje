const { ipcMain } = require("electron");
const productDocs = require("../db/productDocs");
const calcOneProduct = require("../calculators/calcOneProduct");
const { isProductValid } = require("../modules/validator");
const { normalizeProduct } = require("../modules/nomalizer");

  ipcMain.on("send-allProducts", (event) => {
    productDocs.getUnFinishedProducts((docs) => {
      event.reply("allProducts", docs);
    });
  });

ipcMain.on("search-products", (event, searchFilters) => {
  productDocs.searchProducts(searchFilters, (docs) => {
    event.reply("search-products", docs);
  });
});

ipcMain.on("send-oneProduct", (event, id) => {
  productDocs.getOneProduct(id, (docs) => {
    event.reply("oneProduct", docs);
  });
});

ipcMain.on("send-oneProductCalcs", (event, id) => {
  calcOneProduct.calculate(id, (results) => {
    event.reply("oneProductCalcs", results);
  });
});

ipcMain.on("includeProduct", (event, product) => {
  product = normalizeProduct(product);
  if (isProductValid(product)) {
    productDocs.insert(product, () => {
      event.reply("includeProduct", true);
    });
  } else {
    event.reply("includeProduct", false);
  }
});

ipcMain.on('editProduct', (event, product) => {
  product = normalizeProduct(product);
  if(isProductValid(product)) {
    productDocs.update(product._id, product, () =>{
      event.reply('editProduct', true);
    })
  } else {
    event.reply('editProduct', false);
  }
})
