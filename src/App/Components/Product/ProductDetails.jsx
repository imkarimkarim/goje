import React, { useState, useRef, useEffect } from "react";
const { ipcRenderer } = require("electron");
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Nav from "../Nav.jsx";
import Loading from "../Loading.jsx";
import ShowDate from "../ShowDate.jsx";

export default function ProductDetails() {
  const [details, setDetails] = useState();
  let { id } = useParams();
  const init = useRef(true);

  const sendProductDetails = (id) => {
    ipcRenderer.send("send-oneProductDetails", id);
  };

  useEffect(() => {
    // if (init.current) {
    //   sendProductDetails(id);
    //   ipcRenderer.on("oneProductDetails", (event, productDetails) => {
    //     init.current = false;
    //     setDetails(productDetails);
    //   });
    // }

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("oneProductDetails");
    };
  });

  return details ? (
    <div>
      <Nav title={"/ریزفروش/" + product.customeId} />
      <div className="product-details">
        <h3>ریز فروش</h3>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
