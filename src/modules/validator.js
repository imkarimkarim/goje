const isProductValid = (product) => {
  let pass = true;

  const strings = ["productName", "owner"];
  for (let i = 0; i < strings.length; i++) {
    if (
      typeof product[strings[i]] !== "string" ||
      product[strings[i]].length === 0
    ) {
      pass = false;
      break;
    }
  }
  const integers = [
    "basculeWeight",
    "amount",
    "arrivalDate",
    "commission",
    "unload",
    "portage",
    "cash",
  ];
  for (let i2 = 0; i2 < integers.length; i2++) {
    if (
      typeof product[integers[i2]] !== "number" ||
      isNaN(product[integers[i2]])
    ) {
      pass = false;
      break;
    }
  }
  return pass;
};

function isPValid(p) {
  let pPass = true;
  console.log("checking p validation...", p);
  if (typeof p.productId !== "string" || p.productId.length === 0) {
    pPass = false;
  }
  if (typeof p.amount !== "number" || isNaN(p.amount)) {
    pPass = false;
  }
  if (typeof p.weight !== "number" || isNaN(p.weight)) {
    pPass = false;
  }
  if (typeof p.price !== "number" || isNaN(p.price)) {
    pPass = false;
  }
  
  return pPass;
}

const isFactorValid = (factor) => {

  let pass = true;

  if (typeof factor.owner !== "string" || factor.owner.length === 0) {
    pass = false;
  }

  if (typeof factor.isPayed !== "boolean") {
    pass = false;
  }

  if (
    typeof factor.factorDate !== "number" ||
    typeof factor.changeDate !== "number" ||
    isNaN(factor.factorDate) ||
    isNaN(factor.changeDate)
  ) {
    pass = false;
  }

  for (let i = 0; i < factor.products.length; i++) {
    if (!isPValid(factor.products[i])) {
      pass = false;
      break;
    }
  }

  return pass;
};

module.exports = {
  isProductValid,
  isFactorValid,
};