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

export const convertToIntIfIsNumber = (number) => {
  if(!isNaN(number)){
    return parseInt(number);
  }
};
