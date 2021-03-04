import React from 'react';

export default function Expense({num}) {
  
  const letsWriterBetter = (num) => {
    if(!num) return num;
    num = num.toString();
    let newNum = '';
    let count = 1;
    for(let i = num.length - 1; i >= 0; i--) {
      newNum = num[i] + newNum;
      if(count % 3 === 0 && i !== num.length -1 && i !== 0){
          newNum = ',' + newNum;
      }
      count++;
    }
    return newNum;
  }
  
  num = letsWriterBetter(num);
  
  return <>{num} ریال</>
}