const {generateNewCustomId} = require('./idGenerator');

const createCustomer = (name, address, callback) => {
  generateNewCustomId((id) => {
    let newCustomer = {
      docType: 'customer',
      customeId: null,
      name: '',
      address: '',
    }
    newCustomer.name = name;
    newCustomer.address = address;
    newCustomer.customeId = id;
    if (typeof callback === "function") {
      callback(newCustomer);
    }
  })
}

module.exports = {
  createCustomer,
}