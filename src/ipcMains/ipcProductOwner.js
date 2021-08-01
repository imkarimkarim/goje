const { ipcMain } = require("electron");
const productOwnerDocs = require("../db/productOwnerDocs");
const { isProductOwnerValid } = require("../modules/validator");
const { normalizeProductOwner } = require("../modules/nomalizer");

ipcMain.on("getAllProductOwners", (event) => {
  productOwnerDocs.getAll((productOwners) => {
    event.reply("getAllProductOwners", productOwners);
  });
});

ipcMain.on("addNewProductOwner", (event, productOwner) => {
  if (!productOwner) event.reply("addNewProductOwner", false);
  productOwner = normalizeProductOwner(productOwner);
  if (isProductOwnerValid(productOwner)) {
    productOwnerDocs.isProductOwnerExists(productOwner, (docs) => {
      if (docs.length === 0) {
        productOwnerDocs.insert(productOwner, () => {
          event.reply("addNewProductOwner", true);
        });
      } else {
        event.reply("addNewProductOwner", false);
      }
    });
  } else {
    event.reply("addNewProductOwner", false);
  }
});
