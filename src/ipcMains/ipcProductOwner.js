const { ipcMain } = require("electron");
const productOwnerDocs = require("../db/productOwnerDocs");
const { isProductOwnerValid } = require("../modules/validator");
const { normalizeProductOwner } = require("../modules/nomalizer");

ipcMain.on("getAllProductOwners", (event) => {
  productOwnerDocs.getAll((owners) => {
    event.reply("getAllProductOwners", owners);
  });
});

ipcMain.on("addNewProductOwner", (event, owner) => {
  if (!owner) event.reply("addNewProductOwner", false);
  owner = normalizeProductOwner(owner);
  if (isProductOwnerValid(owner)) {
    productOwnerDocs.isProductOwnerExists(owner.name, (docs) => {
      if (docs.length === 0) {
        productOwnerDocs.insert(owner, () => {
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
