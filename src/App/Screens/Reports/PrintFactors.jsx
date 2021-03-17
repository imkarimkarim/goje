import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
const { ipcRenderer } = require("electron");
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Loading from "../../Components/Loading.jsx";
import Expense from "../../Components/Expense.jsx";
import Header from "../../Components/Header.jsx";
import ProductsTable from "../../Components/Product/ProductsTable.jsx";
import Footer from "../../Components/Footer.jsx";
import "./PrintFactors.css";
import html2pdf from "html2pdf.js";

// TODO: backuping db, opening db
// TODO: print this + signle print factor

const RenderFactor = ({ factor }) => {
  let factorDate;
  let tmpJdate;
  if (factor && factor.factorDate) {
    tmpJdate = new JDate(new Date(factor.factorDate));
    factorDate = tmpJdate.format("dddd DD MMMM YYYY");
  }

  return (
    <div className="factorPrint-wrapper">
      <Grid container spacing={3}>
        <Grid className="header" item xs={12}>
          <div>
            <h3>صورتحساب {factor.ownerName}</h3>
          </div>
          <div>{factorDate ? factorDate : "تایرخخخخخخخخخخ"}</div>
          <div>{factor && factor.isPayed ? "نقدی" : "نسیه"}</div>
        </Grid>
        <Divider />
        <Grid item className="products-section" xs={12}>
          <ProductsTable pays={factor.pays} products={factor.products} />
        </Grid>
        <Divider />
        {factor && factor.isPayed ? (
          <Grid item className="addpay-section" xs={12}>
            <Pays pays={factor.pays} />
          </Grid>
        ) : (
          <div></div>
        )}
      </Grid>
    </div>
  );
};

export default function PrintFactors() {
  const [factors, setFactors] = useState();
  let { date } = useParams();
  date = parseInt(date);
  const init = useRef(true);

  const oneDay = 86400000;

  const printFactors = (fromm, till) => {
    ipcRenderer.send("print-factors", { from: fromm, till: till });
  };

  useEffect(() => {
    if (init.current) {
      printFactors(date, date + oneDay);
      init.current = false;
    }

    ipcRenderer.on("print-factors", (event, findedFactors) => {
      setFactors(findedFactors);
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("print-factors");
    };
  });

  return factors ? (
    <div className="dailyReportPrint">
      {factors.map((f) => {
        <RenderFactor factor={f} />;
      })}
      <RenderFactor factor={factors[0]} />
    </div>
  ) : (
    <Loading />
  );
}
