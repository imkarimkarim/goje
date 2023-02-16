const { ipcMain } = require("electron");
const customerDocs = require("../db/customerDocs");
const { validateCustomer } = require("../modules/validator");

ipcMain.on("getAllCustomers", (event) => {
  customerDocs.getAll((customers) => {
    event.reply("getAllCustomers", customers);
  });
});

ipcMain.on("toggleHideInCustomerInput", (event, customerId) => {
    customerDocs.toggleHideInCustomerInput(customerId, () => {
        event.reply("toggleHideInCustomerInput", true);
    });
});

ipcMain.on("addNewCustomer", (event, customer) => {
  validateCustomer(customer, (status, message) => {
    if (status === true) {
      customerDocs.isCustomerExists(customer, (docs) => {
        if (docs.length === 0) {
          customerDocs.insert(customer, () => {
            event.reply("addNewCustomer", {
              status: status,
              message: "حساب جدید با موفقیت ایجاد شد",
            });
          });
        } else {
          event.reply("addNewCustomer", {
            status: false,
            message: "خطا در ایجاد حساب(شاید حسابی با همین نام موجود باشد)",
          });
        }
      });
    }
    if (status === false) {
      event.reply("addNewCustomer", { status: false, message: message });
    }
  });
});
