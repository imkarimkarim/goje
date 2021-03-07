const { ipcMain } = require("electron");
const customerDocs = require("../db/customerDocs");

ipcMain.on('allCustomers', (event) => {
  customerDocs.getAll((customers) => {
    event.reply('allCustomers', customers);
  })
})

ipcMain.on("addCustomer", (event, customer) => {
  if(!customer.name && !customer.address) event.reply('addCustomer', false);
  customerDocs.isCustomerExists(customer.name, customer.address, (docs) => {
    if (docs.length === 0) {
      customerDocs.insert(customer.name, customer.address, () => {
        // log customer added...
        event.reply('addCustomer', true);
      });
    } else {
      // custer is already there
      event.reply('addCustomer', false);
    }
  });
});
