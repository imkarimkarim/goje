import React, { useState, useRef, useEffect } from "react";
import Loading from "../../../../../Components/Loading.jsx";
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";
const { ipcRenderer } = require("electron");


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
        <h3>
          فروش <Divider />
        </h3>
      </div>
    ) : (
      <Loading />
    )

  )
};
 