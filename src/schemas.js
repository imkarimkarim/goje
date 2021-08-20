export const productSchema = {
  inputByUser: {
    productName: { type: 'string', required: true, range: [2, 25], defaultValue: '' },
    signHint: { type: 'string', required: false, range: [1, 15], defaultValue: '' },
    owner: { type: 'string', required: true, range: [3, 50], defaultValue: ''},
    ownerId: { type: 'string', required: true, range: [], defaultValue: '' },
    basculeWeight: { type: 'number', required: true, range: [0], defaultValue: '' },
    amount: { type: 'number', required: true, range: [0], defaultValue: '', value: '' },
    arrivalDate: { type: 'number', required: true, range: [], defaultValue: Date.now() },
    finishDate: { type: 'number', required: true, range: [], defaultValue: false},
    isProductFinish: { type: 'boolean', required: true, range: [], defaultValue: false },
    commission: { type: 'number', required: true, range: [0, 100], defaultValue: '' },
    unload: { type: 'number', required: true, range: [0], defaultValue: '' },
    portage: { type: 'number', required: true, range: [0], defaultValue: '' },
    cash: { type: 'number', required: true, range: [0], defaultValue: '' },
    plaque: { type: 'string', required: false, range: [0, 17], defaultValue: '' },
    ps: { type: 'string', required: false, range: [0, 550], defaultValue: '' },
    inCar: { type: 'string', required: true, range: [], defaultValue: ''},
  },
  autoInput: {
    docType: { type: 'string', required: true, range: [], defaultValue: 'product'},
    customeId: { type: 'string', required: true, range: [], defaultValue: ''},
    warningCalcs: {
      productPriceLength: "productPriceLength",
      productPrice: "price",
      averageAmount: "averageAmount",
      averageWeigth: "averageWeigth",
    },
  }
}

// cheat: { type: 'object', required: false, range: [], defaultValue: {}, childs: {
// amount,
// weight,
// price,
// }},

export const generateInputByUserProductSchema = () => {
  let schema = {};
  const keys = Object.keys(productSchema.inputByUser);
  for(let i = 0; i < keys.length; i++){
    schema[keys[i]] = productSchema.inputByUser[keys[i]].defaultValue;
  }
  return schema;
}

// TODO: add this to productSchema
// NEW: { field: 'isPayed', type: 'boolean', required: true, range: [0, 100], defaultValue: '' },
// New: calcs
// NEW: last time printed

export const customerSchema = {
  inputByUser: {
    name: { type: 'string', required: true, range: [3, 50], defaultValue: '' },
  },
  autoInput: {
    docType: { type: 'string', required: true, range: [], defaultValue: 'customer'},
    customeId: { type: 'string', required: true, range: [], defaultValue: ''},
  }
}

export const generateInputByUserCustomerSchema = () => {
  let schema = {};
  const keys = Object.keys(customerSchema.inputByUser);
  for(let i = 0; i < keys.length; i++){
    schema[keys[i]] = customerSchema.inputByUser[keys[i]].defaultValue;
  }
  return schema;
}

export const productOwnerSchema = {
  inputByUser: {
    name: { type: 'string', required: true, range: [3, 50], defaultValue: '' },
    payNumber: { type: 'string', required: false, range: [0, 28], defaultValue: '' },
    defaultCommission: { type: 'number', required: false, range: [0, 100], defaultValue: '' }
  },
  autoInput: {
    docType: { type: 'string', required: true, range: [], defaultValue: 'productOwner'},
    customeId: { type: 'string', required: true, range: [], defaultValue: ''},
  }
}

// // TODO: to add...
// NEW: pays: [
//   {
//     title:,
//     amount:,
//     ps:,
//     forProducs: []
//   }
// ]

export const generateInputByUserProductOwnerSchema = () => {
  let schema = {};
  const keys = Object.keys(productOwnerSchema.inputByUser);
  for(let i = 0; i < keys.length; i++){
    schema[keys[i]] = productOwnerSchema.inputByUser[keys[i]].defaultValue;
  }
  return schema;
}


export const factorSchema = {
  inputByUser: {
    owner: { type: 'string', required: true, range: [], defaultValue: ''},
    ownerName: { type: 'string', required: true, range: [3, 50], defaultValue: '' },
    isPayed: { type: ['string', 'boolean'], required: true, range: [], defaultValue: '' },
    factorDate: { type: 'number', required: true, range: [], defaultValue: Date.now() },
    changeDate: { type: 'number', required: true, range: [], defaultValue: Date.now() },
    products: { type: 'array', required: true, range: [1-22], defaultValue: [],
      childs: {
        productId: { type: 'string', required: true, range: [], defaultValue: ''},
        productName: { type: 'string', required: true, range: [2, 25], defaultValue: '' },
        amount: { type: 'number', required: true, range: [0], defaultValue: '' },
        weight: { type: 'number', required: true, range: [0], defaultValue: '' },
        price: { type: 'number', required: true, range: [0], defaultValue: '' },
    }},
    calcs: {
      type: 'array', required: true, range: [0], defaultValue: [],
      fullSum: { type: 'number', required: true, range: [0], defaultValue: '' },
      sums: { type: 'array', required: true, range: [1-22], defaultValue: [] ,
      childs: {
        amount: { type: 'number', required: true, range: [0], defaultValue: '' },
      }},
    },
    pays: { type: 'array', required: false, range: [0-4], defaultValue: [] ,
      childs: {
        date: { type: 'number', required: true, range: [], defaultValue: Date.now() },
        amount: { type: 'number', required: true, range: [0], defaultValue: '' }
      }
    },
  },
  autoInput: {
    docType: { type: 'string', required: true, range: [], defaultValue: 'factor'},
    customeId: { type: 'string', required: true, range: [], defaultValue: ''},
  }
}

// NEW: last time printed
// NEW: مبلغ .... هزار ریال بابت .... به فاکتور اضافه شد

export const generateInputByUserFactorSchema = () => {
  let schema = {};
  const keys = Object.keys(factorSchema.inputByUser);
  for(let i = 0; i < keys.length; i++){
    schema[keys[i]] = factorSchema.inputByUser[keys[i]].defaultValue;
  }
  return schema;
}


export const carSchema = {
  inputByUser: {
    owner: { type: 'string', required: true, range: [3, 25], defaultValue: ''},
    ownerId: { type: 'string', required: true, range: [], defaultValue: '' },
    products: { type: 'array', required: true, range: [0, 22], defaultValue: [],
    childs: {
        productName: { type: 'string', required: true, range: [2, 25], defaultValue: '' },
        signHint: { type: 'string', required: false, range: [1, 15], defaultValue: '' },
        amount: { type: 'number', required: true, range: [0], defaultValue: '' },
        weight: { type: 'number', required: true, range: [0], defaultValue: '' },
        price: { type: 'number', required: true, range: [0], defaultValue: '' },
        customeId: { type: 'string', required: true, range: [], defaultValue: ''},
    }},
    basculeWeight: { type: 'number', required: true, range: [0], defaultValue: '' },
    arrivalDate: { type: 'number', required: true, range: [], defaultValue: Date.now() },
    printDate: { type: 'number', required: true, range: [], defaultValue: false},
    commission: { type: 'number', required: true, range: [0, 100], defaultValue: '' },
    unload: { type: 'number', required: true, range: [0], defaultValue: '' },
    portage: { type: 'number', required: true, range: [0], defaultValue: '' },
    cash: { type: 'number', required: true, range: [0], defaultValue: '' },
    plaque: { type: 'string', required: false, range: [0, 17], defaultValue: '' },
    ps: { type: 'string', required: false, range: [0, 550], defaultValue: '' },
    isPrinted: { type: 'boolean', required: true, range: [], defaultValue: false },
    warningCalcs: { type: 'object', require: true, range: [], defaultValue: {},
    childs: {
      productPriceLength: "productPriceLength",
      averageAmount: 1,
      averageWeigth: "averageWeigth",
    }}
  },
  autoInput: {
    docType: { type: 'string', required: true, range: [], defaultValue: 'car'},
    customeId: { type: 'string', required: true, range: [], defaultValue: ''},
  }
}

export const generateInputByUserCarSchema = () => {
  let schema = {};
  const keys = Object.keys(carSchema.inputByUser);
  for(let i = 0; i < keys.length; i++){
    schema[keys[i]] = carSchema.inputByUser[keys[i]].defaultValue;
  }
  return schema;
}
