import React, { useRef } from "react";
import Expense from "../Expense.jsx";
import calcSumFactor from "../../../calculators/calcSumFactor";

const Conclusion = ({ products, pays }) => {
  const fullSum = useRef(0);
  const fullSumPays = useRef(0);

  if (!pays || pays.length === 0) {
    pays = { date: 0, amount: 0 };
  }

  fullSum.current = 0;
  fullSumPays.current = 0;

  if (products && products.length > 0) {
    calcSumFactor.calculate(products, pays, (calcs) => {
      fullSum.current = calcs.fullSum;
      fullSumPays.current = calcs.fullSumPays;
    });
  }

  return (
    <div>
      <div className="fullSum">
        جمع کل:‌ {<Expense num={fullSum.current} />}
      </div>
      <div className="fullSum">
        قابل پرداخت:‌ {<Expense num={fullSum.current - fullSumPays.current} />}
      </div>
    </div>
  );
};

export default Conclusion;
