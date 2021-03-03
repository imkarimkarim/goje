import React, { useState, useRef, useEffect } from "react";
import Loading from "../../../../Components/Loading.jsx";
const { ipcRenderer } = require("electron");
import { useParams } from "react-router-dom";
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";
import "./ShowProduct.css";
import Info from "./Sections/Info.jsx";
import Sale from './Sections/Sale.jsx';

export default function ShowProduct() {
  const [product, setProduct] = useState();
  let { id } = useParams();
  const init = useRef(true);

  const sendOneProduct = (id) => {
    ipcRenderer.send("send-oneProduct", id);
  };

  useEffect(() => {
    if (init.current) {
      sendOneProduct(id);
      ipcRenderer.on("oneProduct", (event, oneProduct) => {
        init.current = false;
        setProduct(oneProduct);
      });
    }

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("oneProduct");
    };
  });

  return (
    <div>
      {product ? (
        <div className="product-wrapper">
          <Info product={product} />
          <Sale productId={product.customeId}/>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
