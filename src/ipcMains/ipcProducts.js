const { ipcMain } = require("electron");
const productDocs = require("../db/productDocs");

let allProducts = {};
let oneProduct = {};

ipcMain.on("send-allProducts", (event) => {
  productDocs.getUnFinishedProducts((docs) => {
    allProducts = docs;
    event.reply("allProducts", allProducts);
  });
});

ipcMain.on("send-oneProduct", (event, id) => {
  console.log(id);
  productDocs.getOneProduct(id, (docs) => {
    oneProduct = docs;
    console.log(oneProduct);
    event.reply("oneProduct", oneProduct);
  });
});
