const newProduct = {
  docType: 'product',
  customeId: null,
  productName: 'سیب سفید',
  owner: 'کاک رسول آذربایجان',
  basculeWeight: 2000,
  amount: 190,
  arrivalDate: Date.now(),
  finishDate: false,
  isProductFinish: false,
  commission: 5,
  unload: 1500000,
  portage: 10000000,
  cash: 1000000,
  driverInfo: {
    name: 'کریم گورابی',
    plaque: '۱۲ت۱۹ایران۱۸',
    car: 'نیسان',
  }
}

const newCustomer = {
  docType: 'customer',
  customeId: null,
  name: 'افشین',
  address: 'آستانه',
}

const newFactor = {
  docType: 'factor',
  owner: 'b79a',
  by: 'b799',
  customeId: null,
  isPayed: false,
  payedDate: null,
  factorDate: new JDate,
  changeDate : null,
  payedRecords: [
    {
      payedDate: null,
      payedAmount: null,
    }
  ],
  products : [
    {
      productId: 'b798',
      amount: 50,
      weight: 545,
      price: 80000,
    },
  ]  
}