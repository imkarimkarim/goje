const { ipcMain } = require("electron");
const productOwnerDocs = require("../db/productOwnerDocs");
const { validateProductOwner } = require("../modules/validator");

ipcMain.on("getAllProductOwners", (event) => {
  productOwnerDocs.getAll((productOwners) => {
    event.reply("getAllProductOwners", productOwners);
  });
});

ipcMain.on("addNewProductOwner", (event, productOwner) => {
  validateProductOwner(productOwner, (status, message) => {
    if (status === true) {
      productOwnerDocs.isProductOwnerExists(productOwner, (docs) => {
        if (docs.length === 0) {
          productOwnerDocs.insert(productOwner, () => {
            event.reply("addNewProductOwner", {
              status: status,
              message: "حساب جدید با موفقیت ایجاد شد",
            });
          });
        } else {
          event.reply("addNewProductOwner", {
            status: false,
            message: "خطا در ایجاد حساب(شاید حسابی با همین نام موجود باشد)",
          });
        }
      });
    }
    if (status === false) {
      event.reply("addNewProductOwner", { status: status, message: message });
    }
  });
});
