const { ipcMain } = require("electron");
const customerDocs = require("../db/customerDocs");

ipcMain.on("isCustomerExists", (event, customer) => {
  customerDocs.isCustomerExists(customer.name, customer.address, (docs) => {
    if (docs.length === 0) {
      customerDocs.insert(customer.name, customer.address, () => {
        console.log("object created succesfuully");
      });
    } else {
      console.log("its there already");
    }
    // event.reply("customerExists", allProducts);
  });
});
