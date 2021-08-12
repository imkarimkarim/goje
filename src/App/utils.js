export const cleanTime = (timeStamp) => {
  const t = new Date(timeStamp);
  t.setHours(0);
  t.setMilliseconds(0);
  t.setMinutes(0);
  t.setSeconds(0);
  return t.getTime();
};

export const oneDay = 86400000;
export const oneWeek = oneDay * 7;
export const oneMonth = oneDay * 30;
export const oneYear = oneMonth * 12;

const persianNumberToEnglish = (num) => {
  if (!num) return num;
  num = num
    .replace(/۰/g, "0")
    .replace(/۱/g, "1")
    .replace(/۲/g, "2")
    .replace(/۳/g, "3")
    .replace(/۴/g, "4")
    .replace(/۵/g, "5")
    .replace(/۶/g, "6")
    .replace(/۷/g, "7")
    .replace(/۸/g, "8")
    .replace(/۹/g, "9");
  return num;
};

export const convertToIntIfIsNumber = (number) => {
  number = persianNumberToEnglish(number);
  if (
    !isNaN(number) &&
    number !== "" &&
    typeof number == "string" &&
    number.toString().length != 0
  ) {
    return parseInt(number);
  } else {
    return number;
  }
};

export const productsToString = (products) => {
  if (!products) return;
  let string = "";
  for (let i = 0; i < products.length; i++) {
    if (i === products.length - 1) {
      string = string + products[i].productName;
    } else {
      string = string + products[i].productName + "، ";
    }
  }
  return string;
};

export const isRangeOk = (num, min, max) => {
  if (isInt(num) && isInt(min) && isInt(max)) {
    if (min <= num && max >= num) return true;
    return false;
  } else if (isInt(num) && isInt(min)) {
    if (min <= num) return true;
    return false;
  }
};

export const isString = (str) => {
  if (typeof str !== "string") return false;
  return true;
};

export const isInt = (num) => {
  if (typeof num == "number") return true;
  return false;
};
