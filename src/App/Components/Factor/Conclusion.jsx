import React, { useState, useRef, useEffect } from "react";
import Expense from "../Expense.jsx";

export default function Conclusion({ products, pays }) {
  const fullSum = useRef(0);
  const fullSumPays = useRef(0);
  if (products) {
    fullSum.current = 0;
    for (let i = 0; i < products.length; i++) {
      fullSum.current += Math.round(100 * (products[i].weight * products[i].price)) / 100;
    }
    if(pays && pays.length > 0){
      fullSumPays.current = 0;
      for(let i2 = 0; i2 < pays.length; i2++) {
        fullSumPays.current += Math.round(100 * pays[i2].amount) / 100;
      }
    }
    else {
      fullSumPays.current = 0;
    }
  }
  return (
    <div>
      <div className="fullSum">جمع کل:‌ {<Expense num={fullSum.current} />}</div>
      <div className="fullSum">قابل پرداخت:‌ {<Expense num={fullSum.current - fullSumPays.current} />}</div>
    </div>
  );
}
