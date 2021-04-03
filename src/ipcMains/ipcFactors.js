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

ipcMain.on('editFactor', (event, factor) => {
  factor = normalizeFactor(factor);
  console.log(factor);
  if(isFactorValid(factor)){
    factor.changeDate = Date.now();
    factorDocs.update(factor._id, factor, () => {
      event.reply('editFactor', true);
    })
  }
  else {
    event.reply('newFactor', false);
  }
})

ipcMain.on("search-factors", (event, searchFilters) => {
  factorDocs.SearchFactors(searchFilters, (docs) => {
    event.reply("search-factors", docs);
  });
});

ipcMain.on("send-oneFactor", (event, factorId) => {
  factorDocs.getOne(factorId, (docs) => {
    event.reply("send-oneFactor", docs);
  });
});

ipcMain.on('print-factors', (event, date) => {
  if(!date) return;
  factorDocs.factorsWithFactordate(date.from, date.till, (docs) => {
    event.reply('print-factors', docs);
  })
})
