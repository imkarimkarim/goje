const { ipcMain } = require("electron");
const factorDocs = require('../db/factorDocs');
const {normalizeFactor} = require('../modules/nomalizer');
const {isFactorValid} = require('../modules/validator');

ipcMain.on('newFactor', (event, factor) => {
  factor = normalizeFactor(factor);
  if(isFactorValid(factor)){
    factorDocs.insert(factor, () =>{
      event.reply('newFactor', true);
    })
  }
  else {
    event.reply('newFactor', false);
  }
})