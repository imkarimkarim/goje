const {
  productSchema,
  carSchema,
  productOwnerSchema,
  customerSchema,
  factorSchema,
} = require("../schemas");

const isString = (str) => {
  if (typeof str !== "string") return false;
  return true;
};

const isInt = (num) => {
  if (typeof num == "number") return true;
  return false;
};

const isRangeOk = (num, min, max) => {
  if (isInt(num) && isInt(min) && isInt(max)) {
    if (min <= num && max >= num) return true;
    return false;
  } else if (isInt(num) && isInt(min)) {
    if (min <= num) return true;
    return false;
  }
};

const validateCar = (car, callback) => {
  if (!car) return false;
  let errorMessage = ``;
  let status = true;

  const ps = carSchema.inputByUser;

  // owner
  if (car.owner === ps.owner.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
     / صاحب بار انتخاب نشده است`;
  }

  // basculeWeight
  if (car.basculeWeight === ps.basculeWeight.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
     / باسکول وارد نشده است (درصورت نداشتن باسکول صفر وارد کنید)`;
  } else if (!isInt(car.basculeWeight)) {
    status = false;
    errorMessage = `${errorMessage}
     / باسکول باید عدد باشد`;
  } else if (!isRangeOk(car.basculeWeight, ps.basculeWeight.range[0])) {
    status = false;
    errorMessage = `${errorMessage}
     / باسکول نمیتواند منفی باشد`;
  }

  // commission
  if (car.commission === ps.commission.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
   / کارمزد وارد نشده است`;
  } else if (!isInt(car.commission)) {
    status = false;
    errorMessage = `${errorMessage}
   / کارمز باید عدد باشد`;
  } else if (
    !isRangeOk(car.commission, ps.commission.range[0], ps.commission.range[1])
  ) {
    status = false;
    errorMessage = `${errorMessage}
   / کارمزد باید بین ۰ تا ۱۰۰ باشد`;
  }

  // unload
  if (car.unload === ps.unload.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
   / تخلیه وارد نشده است (در صورت نداشتن تخلیه صفر وارد کنید)`;
  } else if (!isInt(car.unload)) {
    status = false;
    errorMessage = `${errorMessage}
   / تخلیه باید عدد باشد`;
  } else if (!isRangeOk(car.unload, ps.unload.range[0])) {
    status = false;
    errorMessage = `${errorMessage}
   / تخلیه نمیتواند منفی باشد`;
  }

  // portage
  if (car.portage === ps.portage.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
   / کرایه وارد نشده است (در صورت نداشتن کرایه صفر وارد کنید)`;
  } else if (!isInt(car.portage)) {
    status = false;
    errorMessage = `${errorMessage}
   / کرایه باید عدد باشد`;
  } else if (!isRangeOk(car.portage, ps.portage.range[0])) {
    status = false;
    errorMessage = `${errorMessage}
   / کرایه نمیتواند منفی باشد`;
  }

  // cash
  if (car.cash === ps.cash.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
   / دستی وارد نشده است (در صورت نداشتن دستی صفر وارد کنید)`;
  } else if (!isInt(car.cash)) {
    status = false;
    errorMessage = `${errorMessage}
   / دستی باید عدد باشد`;
  } else if (!isRangeOk(car.cash, ps.cash.range[0])) {
    status = false;
    errorMessage = `${errorMessage}
   / دستی نمیتواند منفی باشد`;
  }

  // plaque
  if (!isRangeOk(car.plaque.length, ps.plaque.range[0], ps.plaque.range[1])) {
    status = false;
    errorMessage = `${errorMessage}
   / حداکثر تعداد کارکترهای مجاز برای پلاک ۱۶ کارکتر است`;
  }

  // ps
  if (!isRangeOk(car.ps.length, ps.ps.range[0], ps.ps.range[1])) {
    status = false;
    errorMessage = `${errorMessage}
   / حداکثر تعداد کارکترهای مجاز برای پی‌نوشت ۵۵۰ کارکتر است`;
  }

  // products
  if (car.products.length === ps.products.defaultValue.length) {
    status = false;
    errorMessage = `${errorMessage}
        / شرح باری وارد نشده است`;
  } else if (
    !isRangeOk(car.products.length, ps.products.range[0], ps.products.range[1])
  ) {
    status = false;
    errorMessage = `${errorMessage}
     / تعداد بارهای ورودی نمیتواند کمتر از ۱ و بیشتر از ۲۲ باشد`;
  } else {
    for (let i = 0; i < car.products.length; i++) {
      const ppc = ps.products.childs;
      const productName = car.products[i].productName;
      const amount = car.products[i].amount;
      const weight = car.products[i].weight;
      const price = car.products[i].price;

      // productName
      if (productName === ppc.productName.defaultValue) {
        status = false;
        errorMessage = `${errorMessage}
         / شرح بار وارد نشده است`;
      } else if (!isString(productName)) {
        status = false;
        errorMessage = `${errorMessage}
         / شرح بار باید متنی باشد`;
      } else if (
        !isRangeOk(
          productName.length,
          ppc.productName.range[0],
          ppc.productName.range[1]
        )
      ) {
        status = false;
        errorMessage = `${errorMessage}
         / تعداد کارکترهای مجاز برای شرح بار بین ۲ تا ۳۰ است`;
      }

      if (amount !== ppc.amount.defaultValue) {
        if (!isInt(amount)) {
          status = false;
          errorMessage = `${errorMessage}
         / در سطر شماره ${i + 1}
         تعداد باید عدد باشد`;
        } else if (!isRangeOk(amount, ppc.amount.range[0])) {
          status = false;
          errorMessage = `${errorMessage}
         / در سطر شماره ${i + 1}
         تعداد نمیتواند منفی باشد`;
        }
      }

      if (weight !== ppc.weight.defaultValue) {
        if (!isInt(weight)) {
          status = false;
          errorMessage = `${errorMessage}
     / در سطر شماره ${i + 1}
     وزن باید عدد باشد`;
        } else if (!isRangeOk(weight, ppc.weight.range[0])) {
          status = false;
          errorMessage = `${errorMessage}
     / در سطر شماره ${i + 1}
     وزن نمیتواند منفی باشد`;
        }
      }

      if (price !== ppc.price.defaultValue) {
        if (!isInt(price)) {
          status = false;
          errorMessage = `${errorMessage}
     / در سطر شماره ${i + 1}
     فی باید عدد باشد`;
        } else if (!isRangeOk(price, ppc.price.range[0])) {
          status = false;
          errorMessage = `${errorMessage}
     / در سطر شماره ${i + 1}
     فی نمیتواند منفی باشد`;
        }
      }
    }
  }

  if (typeof callback === "function") {
    callback(status, errorMessage);
  }
};

const validateProduct = (product, callback) => {
  if (!product) return false;
  let errorMessage = ``;
  let status = true;

  const ps = productSchema.inputByUser;

  // productName
  if (product.productName === ps.productName.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
     / شرح بار وارد نشده است`;
  } else if (!isString(product.productName)) {
    status = false;
    errorMessage = `${errorMessage}
     / شرح بار باید متنی باشد`;
  } else if (
    !isRangeOk(
      product.productName.length,
      ps.productName.range[0],
      ps.productName.range[1]
    )
  ) {
    status = false;
    errorMessage = `${errorMessage}
     / تعداد کارکترهای مجاز برای شرح بار بین ۲ تا ۳۰ است`;
  }

  // owner
  if (product.owner === ps.owner.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
     / صاحب بار انتخاب نشده است`;
  }

  // basculeWeight
  if (product.basculeWeight === ps.basculeWeight.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
     / باسکول وارد نشده است (درصورت نداشتن باسکول صفر وارد کنید)`;
  } else if (!isInt(product.basculeWeight)) {
    status = false;
    errorMessage = `${errorMessage}
     / باسکول باید عدد باشد`;
  } else if (!isRangeOk(product.basculeWeight, ps.basculeWeight.range[0])) {
    status = false;
    errorMessage = `${errorMessage}
     / باسکول نمیتواند منفی باشد`;
  }

  // amount
  if (product.amount === ps.amount.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
   / تعداد وارد نشده است (درصورت نداشتن تعداد صفر وارد کنید)`;
  } else if (!isInt(product.amount)) {
    status = false;
    errorMessage = `${errorMessage}
   / تعداد باید عدد باشد`;
  } else if (!isRangeOk(product.amount, ps.amount.range[0])) {
    status = false;
    errorMessage = `${errorMessage}
   / تعداد نمیتواند منفی باشد`;
  }

  // commission
  if (product.commission === ps.commission.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
   / کارمزد وارد نشده است`;
  } else if (!isInt(product.commission)) {
    status = false;
    errorMessage = `${errorMessage}
   / کارمز باید عدد باشد`;
  } else if (
    !isRangeOk(
      product.commission,
      ps.commission.range[0],
      ps.commission.range[1]
    )
  ) {
    status = false;
    errorMessage = `${errorMessage}
   / کارمزد باید بین ۰ تا ۱۰۰ باشد`;
  }

  // unload
  if (product.unload === ps.unload.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
   / تخلیه وارد نشده است (در صورت نداشتن تخلیه صفر وارد کنید)`;
  } else if (!isInt(product.unload)) {
    status = false;
    errorMessage = `${errorMessage}
   / تخلیه باید عدد باشد`;
  } else if (!isRangeOk(product.unload, ps.unload.range[0])) {
    status = false;
    errorMessage = `${errorMessage}
   / تخلیه نمیتواند منفی باشد`;
  }

  // portage
  if (product.portage === ps.portage.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
   / کرایه وارد نشده است (در صورت نداشتن کرایه صفر وارد کنید)`;
  } else if (!isInt(product.portage)) {
    status = false;
    errorMessage = `${errorMessage}
   / کرایه باید عدد باشد`;
  } else if (!isRangeOk(product.portage, ps.portage.range[0])) {
    status = false;
    errorMessage = `${errorMessage}
   / کرایه نمیتواند منفی باشد`;
  }

  // cash
  if (product.cash === ps.cash.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
   / دستی وارد نشده است (در صورت نداشتن دستی صفر وارد کنید)`;
  } else if (!isInt(product.cash)) {
    status = false;
    errorMessage = `${errorMessage}
   / دستی باید عدد باشد`;
  } else if (!isRangeOk(product.cash, ps.cash.range[0])) {
    status = false;
    errorMessage = `${errorMessage}
   / دستی نمیتواند منفی باشد`;
  }

  // plaque
  if (
    !isRangeOk(product.plaque.length, ps.plaque.range[0], ps.plaque.range[1])
  ) {
    status = false;
    errorMessage = `${errorMessage}
   / حداکثر تعداد کارکترهای مجاز برای پلاک ۱۶ کارکتر است`;
  }

  // ps
  if (!isRangeOk(product.ps.length, ps.ps.range[0], ps.ps.range[1])) {
    status = false;
    errorMessage = `${errorMessage}
   / حداکثر تعداد کارکترهای مجاز برای پی‌نوشت ۵۵۰ کارکتر است`;
  }

  if (typeof callback === "function") {
    callback(status, errorMessage);
  }
};

const validateFactor = (factor, callback) => {
  if (!factor) return false;
  let errorMessage = ``;
  let status = true;

  const ps = factorSchema.inputByUser;

  // owner
  if (factor.owner === ps.owner.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
     / نام مشتری انتخاب نشده است`;
  }

  // isPayed
  if (factor.isPayed === ps.isPayed.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
      / نوع فاکتور (نقدی/نسیه) انتخاب نشده است`;
  }

  // products
  if (factor.products.length === ps.products.defaultValue.length) {
    status = false;
    errorMessage = `${errorMessage}
        / ثبت فاکتور بدون بار امکان پذیر نیست`;
  } else if (
    !isRangeOk(
      factor.products.length,
      ps.products.range[0],
      ps.products.range[1]
    )
  ) {
    status = false;
    errorMessage = `${errorMessage}
     / تعداد بارهای فاکتور نمیتواند کمتر از ۱ و بیشتر از ۲۲ باشد`;
  } else {
    for (let i = 0; i < factor.products.length; i++) {
      const ppc = ps.products.childs;
      const amount = factor.products[i].amount;
      const weight = factor.products[i].weight;
      const price = factor.products[i].price;

      if (!isInt(amount)) {
        status = false;
        errorMessage = `${errorMessage}
         / در سطر شماره ${i + 1}
         تعداد باید عدد باشد`;
      } else if (!isRangeOk(amount, ppc.amount.range[0])) {
        status = false;
        errorMessage = `${errorMessage}
         / در سطر شماره ${i + 1}
         تعداد نمیتواند منفی باشد`;
      }

      if (!isInt(weight)) {
        status = false;
        errorMessage = `${errorMessage}
         / در سطر شماره ${i + 1}
         وزن باید عدد باشد`;
      } else if (!isRangeOk(weight, ppc.weight.range[0])) {
        status = false;
        errorMessage = `${errorMessage}
         / در سطر شماره ${i + 1}
         وزن نمیتواند منفی باشد`;
      }

      if (!isInt(price)) {
        status = false;
        errorMessage = `${errorMessage}
         / در سطر شماره ${i + 1}
         فی باید عدد باشد`;
      } else if (!isRangeOk(price, ppc.price.range[0])) {
        status = false;
        errorMessage = `${errorMessage}
         / در سطر شماره ${i + 1}
         فی نمیتواند منفی باشد`;
      }
    }
  }

  // pays
  if (factor.pays.length > 0) {
    if (!isRangeOk(factor.pays.length, ps.pays.range[0], ps.pays.range[1])) {
      status = false;
      errorMessage = `${errorMessage}
       / تعداد پرداخت شد ها نمیتواند بیشتر از ۴ باشد`;
    } else {
      for (let i = 0; i < factor.pays.length; i++) {
        const ppc = ps.pays.childs;
        const amount = factor.pays[i].amount;

        if (!isInt(amount)) {
          status = false;
          errorMessage = `${errorMessage}
           / مقدار پرداخت شد باید عدد باشد`;
        } else if (
          !isRangeOk(amount, ppc.amount.range[0], ppc.amount.range[1])
        ) {
          status = false;
          errorMessage = `${errorMessage}
            / مقدار پردخت شد نمیتواند منفی باشد`;
        }
      }
    }
  }

  if (typeof callback === "function") {
    callback(status, errorMessage);
  }
};

const validateProductOwner = (productOwner, callback) => {
  if (!productOwner) return false;
  let errorMessage = ``;
  let status = true;

  const ps = productOwnerSchema.inputByUser;

  // name
  if (productOwner.name === ps.name.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
      / نام صاحب بار وارد نشده است`;
  } else if (
    !isRangeOk(productOwner.name.length, ps.name.range[0], ps.name.range[1])
  ) {
    status = false;
    errorMessage = `${errorMessage}
      / تعداد کارکتر های مجاز برای نام صاحب بار بین ۳ تا ۵۰ است`;
  }

  // payNumber
  if (productOwner.payNumber.length > 0) {
    if (
      !isRangeOk(
        productOwner.payNumber.length,
        ps.payNumber.range[0],
        ps.payNumber.range[1]
      )
    ) {
      status = false;
      errorMessage = `${errorMessage}
         / حداکثر تعداد کارکترهای مجاز برای طلاعات واریز ۲۸ کارکتر است`;
    }
  }

  // defaultCommission
  if (productOwner.defaultCommission.length > 0) {
    if (!isInt(productOwner.defaultCommission)) {
      status = false;
      errorMessage = `${errorMessage}
      / کارمزد پیشفرض باید عدد باشد`;
    } else if (
      !isRangeOk(
        productOwner.defaultCommission,
        ps.defaultCommission.range[0],
        ps.defaultCommission.range[1]
      )
    ) {
      status = false;
      errorMessage = `${errorMessage}
      / کارمزد پیشفرض باید بین ۰ تا ۱۰۰ باشد`;
    }
  }

  if (typeof callback === "function") {
    callback(status, errorMessage);
  }
};

const validateCustomer = (customer, callback) => {
  if (!customer) return false;
  let errorMessage = ``;
  let status = true;

  const ps = customerSchema.inputByUser;

  // name
  if (customer.name === ps.name.defaultValue) {
    status = false;
    errorMessage = `${errorMessage}
        / نام مشتری وارد نشده است`;
  } else if (
    !isRangeOk(customer.name.length, ps.name.range[0], ps.name.range[1])
  ) {
    status = false;
    errorMessage = `${errorMessage}
        / تعداد کارکترهای مجاز برای نام مشتری بین ۳ تا ۵۰ کارکتر است`;
  }

  if (typeof callback === "function") {
    callback(status, errorMessage);
  }
};

module.exports = {
  validateProduct,
  validateCustomer,
  validateFactor,
  validateProductOwner,
  validateCar,
};
