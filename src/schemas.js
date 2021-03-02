const newProduct = {
  docType: 'product',
  customeId: null,
  productName: 'سیب سفید',
  owner: 'کاک رسول آذربایجان',
  weight: 200,
  amount: 20,
  arrivalDate: new Date(),
  finishDate: false,
  ownerCardNumber: '2222-1243-1532-1821',
  isProductFinish: false,
  commission: 5,
  driverInfo: {
    name: 'کریم گورابی',
    plaque: '۱۲ت۱۹ایران۱۸',
    car: 'نیسان',
    phoneNumber: '09118561211',
  }
}

const newCustomer = {
  docType: 'customer',
  customeId: null,
  name: 'نقی',
  phoneNumber: null,
  address: 'لولمان',
  by: 'طالب لولمان',
}

const newFactor = {
  docType: 'factor',
  owner: 'b79b',
  customeId: null,
  isPayed: false,
  payedDate: null,
  factorDate: new Date(),
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
      amount: 5,
      weight: 50,
      price: 80000,
    },
    {
      productId: 'b799',
      amount: 4,
      weight: 42,
      price: 100000,
    }
  ]  
}