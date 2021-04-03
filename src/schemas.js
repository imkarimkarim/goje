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
  isPayed: false || true,
  commission: 5,
  unload: 1500000,
  portage: 10000000,
  cash: 1000000,
  plaque: '۱۲ت۱۹ایران۱۸',
}

const newCustomer = {
  docType: 'customer',
  customeId: null,
  name: 'افشین',
}

const newFactor = {
  docType: 'factor',
  owner: 'b79a',
  ownerName: '',
  customeId: null,
  isPayed: false || true || 'receipt',
  factorDate: new JDate,
  changeDate : null,
  products : [
    {
      productId: 'b798',
      productName: '',
      amount: 50,
      weight: 545,
      price: 80000,
    },
  ],
  calcs: {
    fullSum : 0,
    sums: []
  },
  pays: [
    {date: 0, amount: 0}
  ]
}