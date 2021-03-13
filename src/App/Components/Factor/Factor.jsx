import React, { useState, useRef, useEffect } from "react";
const { ipcRenderer } = require("electron");
import { useParams } from "react-router-dom";
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Nav from "../Nav.jsx";
import Loading from "../Loading.jsx";
import Expense from "../Expense.jsx";
import ProductsTable from "../Product/ProductsTable.jsx";
import "./Factor.css";

export default function ProductReports() {
  const [factor, setFactor] = useState();
  let { id } = useParams();
  const init = useRef(true);

  const sendOneFactor = (id) => {
    ipcRenderer.send("send-oneFactor", id);
  };

  useEffect(() => {
    if (init.current) {
      sendOneFactor(id);
      ipcRenderer.on("send-oneFactor", (event, oneFactor) => {
        init.current = false;
        setFactor(oneFactor);
      });
    }

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("send-oneFactor");
    };
  });

  let factorDate;
  let tmpJdate;
  if (factor && factor.factorDate) {
    tmpJdate = new JDate(new Date(factor.factorDate));
    factorDate = tmpJdate.format("dddd DD MMMM YYYY");
  }

  return factor ? (
    <div>
      <Nav title={"/فاکتور/" + factor.customeId} />
      <div className="factor-reports">
        <Grid container spacing={3}>
          <Grid className="header" item xs={12}>
            <h3>صورتحساب {factor.ownerName}</h3>
            {factorDate ? factorDate : "تایرخخخخخخخخخخ"}
          </Grid>
          <Divider />
          <Grid item className="products-section" xs={12}>
            <ProductsTable products={factor.products} />
          </Grid>
          <div className="actions">
            <button>ویرایش</button>
            <button>حذف</button>
            <button>پرینت</button>
          </div>
        </Grid>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
