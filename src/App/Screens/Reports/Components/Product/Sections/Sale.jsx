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
      console.log(productId);
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
  
  if(salesInfo) console.log(salesInfo);
  
  return (
    salesInfo ? (
      <div className="sale">
        <h3>فروش <Divider /></h3>
        <div>{`${salesInfo.SUM_KG} کیلوگرم از ${salesInfo.productData.KG} کیلو فروخته شد.`}</div>
        <div>{`${salesInfo.SUM_AMOUNT} عدد از ${salesInfo.productData.Amount} عدد فروخته شد.`}</div>
        <div>مبلغ کل فروش: {<Expense num={salesInfo.FULL_SALE} />}</div>
        <div>میانگین فی فروش: {<Expense num={salesInfo.SALE_AVERAGE } />}</div>
        <div>کمیسیون (٪{salesInfo.productData.commission}): {<Expense num={salesInfo.COMMISSION} />}</div>
        <div>کارگری و کرایه... + اطلاعات راننده باید اضافه شه...</div>
      </div>
    ) : (
      <Loading />
    )

  )
};
 