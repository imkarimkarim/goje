const { ipcMain } = require("electron");
const factorDocs = require('../db/factorDocs');
const {isFactorValid} = require('../modules/validator');

ipcMain.on('addNewFactor', (event, factor) => {
  if(isFactorValid(factor)){
    factorDocs.insert(factor, () =>{
      event.reply('addNewFactor', true);
    })
  }
  else {
    event.reply('addNewFactor', false);
  }
})

ipcMain.on('editFactor', (event, factor) => {
  if(isFactorValid(factor)){
    factor.changeDate = Date.now();
    factorDocs.update(factor._id, factor, () => {
      event.reply('editFactor', true);
    })
  }
  else {
    event.reply('editFactor', false);
  }
})

ipcMain.on("searchInFactors", (event, searchFilters) => {
  factorDocs.search(searchFilters, (docs) => {
    event.reply("searchInFactors", docs);
  });
});

ipcMain.on("getOneFactor", (event, factorId) => {
  factorDocs.getOne(factorId, (docs) => {
    event.reply("getOneFactor", docs);
  });
});

ipcMain.on('printCreditFactorsByDate', (event, date) => {
  if(!date) return;
  factorDocs.factorsWithFactordate(date.from, date.till, (docs) => {
    event.reply('printCreditFactorsByDate', docs);
  })
})

ipcMain.on('getOneProductDetails', (event, id) => {
  if(!id) return;
  factorDocs.withProduct(id, (docs) => {
    if(docs){
      event.reply('getOneProductDetails', docs);
    }
  })
})
