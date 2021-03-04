import React, { useState, useRef, useEffect } from "react";
import Loading from "../../../../../Components/Loading.jsx";
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";
const { ipcRenderer } = require("electron");
import Cleave from 'cleave.js/react';
import Expense from '../../../../../Components/Expense.jsx';

export default function Info({productId}) {
  const [salesInfo, setsalesInfo] = useState();
  const init = useRef(true);
  
  const sendOneProductCalcs = (productId) => {
    ipcRenderer.send("send-oneProductCalcs", productId);
  };
  
  useEffect(() => {
    if (init.current) {
      sendOneProductCalcs(productId);
      ipcRenderer.on("oneProductCalcs", (event, oneProduct) => {
        init.current = false;
        setsalesInfo(oneProduct);
      });
    }

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("oneProductCalcs");
    };
  });
  
  return (
    salesInfo ? (
      <div>
        <div className="sale">
          <h3>فروش <Divider /></h3>
          <div>{salesInfo.SUM_AMOUNT} عدد</div>
          <div>{salesInfo.SUM_KG} کیلوگرم</div>
          <div>میانگین فی فروش: {<Expense num={salesInfo.SALE_AVERAGE } />}</div>
          <div>مبلغ کل فروش: {<Expense num={salesInfo.FULL_SALE} />}</div>
          
          <h3>صافی <Divider /></h3>
          <div>کرایه:‌ {<Expense num={salesInfo.productData.portage} />}</div>
          <div>تخلیه: {<Expense num={salesInfo.productData.unload} />}</div>
          <div>کارمزد (٪{salesInfo.productData.commission}): {<Expense num={salesInfo.COMMISSION} />}</div>
          <div>دستی: {<Expense num={salesInfo.productData.cash} />}</div>
          <div className='owner-earning'><h3>صافی: {<Expense num={salesInfo.OWNER_ERNINGS} />}</h3></div>
        </div>
      </div>
    ) : (
      <Loading />
    )

  )
};
 