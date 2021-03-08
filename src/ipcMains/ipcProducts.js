const { ipcMain } = require("electron");
const productDocs = require("../db/productDocs");
const calcOneProduct = require("../calculators/calcOneProduct");
const {isProductValid} = require('../modules/validator');
const {normalizeProduct} = require('../modules/nomalizer');

let allProducts = {};
let oneProduct = {};
let resultsCalcOneProduct = {};

ipcMain.on("send-allProducts", (event) => {
  productDocs.getUnFinishedProducts((docs) => {
    allProducts = docs;
    event.reply("allProducts", allProducts);
  });
});

ipcMain.on("send-oneProduct", (event, id) => {
  productDocs.getOneProduct(id, (docs) => {
    oneProduct = docs;
    event.reply("oneProduct", oneProduct);
  });
});

ipcMain.on("send-oneProductCalcs", (event, id) => {
  calcOneProduct.calculate(id, (results) => {
    resultsCalcOneProduct = results;
    event.reply("oneProductCalcs", resultsCalcOneProduct);
  });
});

// ipcMain.on("includeProduct", (event, id) => {
//   calcOneProduct.calculate(id, (results) => {
//     resultsCalcOneProduct = results;
//     event.reply("includeProduct");
//   });
// });

ipcMain.on("includeProduct", (event, product) => {
  product = normalizeProduct(product);
  if(isProductValid(product)){
    productDocs.insert(product, () => {
      event.reply('includeProduct', true)
    })
  } else {
    event.reply('includeProduct', false)
  }
});
