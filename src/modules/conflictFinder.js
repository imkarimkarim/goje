const { isRangeOk } = require("../App/utils.js");

const isRelatedToTheGroup = (product, group) => {
  if (!product || !group) return false;

  const avgProductWeight = product.weight / product.amount;
  let tmp = {};
  for (let i = 0; i < group.length; i++) {
    tmp.avgWeight = group[i].product.weight / group[i].product.amount;
    tmp.price = group[i].product.price;
    if (
      !isRangeOk(avgProductWeight, tmp.avgWeight - 5, tmp.avgWeight + 5) ||
      !isRangeOk(
        product.price,
        tmp.price - (tmp.price * 1.3 - tmp.price),
        tmp.price * 1.3
      )
    ) {
      console.log(false);
      return false;
    }
  }
  console.log(true);
  return true;
};

export const conflictFinder = (records) => {
  if (!records) return;
  let groups = [];
  let relatedGroupFounded = false;
  let index = 0;

  for (let i = 0; i < records.length; i++) {
    relatedGroupFounded = false;
    index = 0;
    while (relatedGroupFounded === false) {
      if (isRelatedToTheGroup(records[i].product, groups[index])) {
        groups[index].push(records[i]);
        relatedGroupFounded = true;
      } else {
        if (index === groups.length) {
          groups.push([records[i]]);
          relatedGroupFounded = true;
        } else {
          index++;
        }
      }
    }
  }

  let newRecords = [];
  console.log(groups);
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].length <= 1) {
      for (let i2 = 0; i2 < groups[i].length; i2++) {
        groups[i][i2].className = "red-color";
        newRecords.push(groups[i][i2]);
      }
    } else if (groups[i].length <= 3) {
      for (let i2 = 0; i2 < groups[i].length; i2++) {
        groups[i][i2].className = "yellow-color";
        newRecords.push(groups[i][i2]);
      }
    } else {
      for (let i2 = 0; i2 < groups[i].length; i2++) {
        newRecords.push(groups[i][i2]);
      }
    }
  }

  return newRecords;
};
