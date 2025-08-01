const { ipcMain } = require("electron");
const factorDocs = require("../db/factorDocs");
const { validateFactor } = require("../modules/validator");

ipcMain.on("addNewFactor", (event, factor) => {
  validateFactor(factor, (status, message) => {
    if (status === true) {
      factorDocs.insert(factor, () => {
        event.reply("addNewFactor", {
          status: status,
          message: "فاکتور با موفقیت ثبت شد",
        });
      });
    }
    if (status === false) {
      event.reply("addNewFactor", { status: status, message: message });
    }
  });
});

ipcMain.on("editFactor", (event, factor) => {
  validateFactor(factor, (status, message) => {
    if (status === true) {
      factor.changeDate = Date.now();
      factorDocs.update(factor._id, factor, () => {
        event.reply("editFactor", {
          status: status,
          message: "ویرایش با موفقیت انجام شد",
        });
      });
    } else {
      event.reply("editFactor", { status: status, message: message });
    }
  });
});

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

ipcMain.on("printCreditFactorsByDate", (event, date) => {
  if (!date) return;
  factorDocs.factorsWithFactordate(date.from, date.till, (docs) => {
    event.reply("printCreditFactorsByDate", docs);
  });
});

ipcMain.on("getOneProductDetails", (event, id) => {
  if (!id) return;
  factorDocs.withProduct(id, (docs) => {
    if (docs) {
      event.reply("getOneProductDetails", docs);
    }
  });
});
