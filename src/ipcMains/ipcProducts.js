const {ipcMain} = require('electron');
const productsDoc = require('../db/productsDoc');

let products = {
  
};

ipcMain.on('send-allProducts', (event) => {
    productsDoc.getAll((docs) => {
      products = docs;
      event.reply('allProducts', products)
    })
});