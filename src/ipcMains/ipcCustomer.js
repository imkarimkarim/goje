const { ipcMain } = require("electron");
const customerDocs = require("../db/customerDocs");

ipcMain.on('getAllCustomers', (event) => {
  customerDocs.getAll((customers) => {
    event.reply('getAllCustomers', customers);
  })
})

ipcMain.on("addNewCustomer", (event, customer) => {
  if(!customer) event.reply('addNewCustomer', false);
  customerDocs.isCustomerExists(customer, (docs) => {
    if (docs.length === 0) {
      customerDocs.insert(customer, () => {
        event.reply('addNewCustomer', true);
      });
    } else {
      event.reply('addNewCustomer', false);
    }
  });
});
