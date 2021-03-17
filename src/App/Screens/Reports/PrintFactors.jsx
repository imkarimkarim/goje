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

const RenderPays = ({ pays }) => {
  let payDate;
  return (
    <p className="printpaysRecords">
      {pays.map((p) => {
        payDate = new JDate(new Date(p.date));
        return (
          <span>
            <span>در تاریخ</span>
            <span> </span>
            <span>{payDate.format('dddd DD MMMM YYYY')}</span>
            <span> - </span>
            <span>{<Expense num={p.amount} />}</span>
            <span> </span>
            <span>داده شد.</span>
            <br />
          </span>
        );
      })}
    </p>
  );
};

const RenderFactor = ({ factor, index, factorsLength }) => {
  let factorDate;
  let tmpJdate;
  if (factor && factor.factorDate) {
    tmpJdate = new JDate(new Date(factor.factorDate));
    factorDate = tmpJdate.format("dddd DD MMMM YYYY");
  }

  console.log(factor, index, factorsLength);

  useEffect(() => {
    if (factorsLength === index + 1) {
      html2pdf(document.body);
    }
  });

  return (
    <div className="factorsPrint-wrapper">
      <Header />
      <div className="printProductsTable">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>شرح بار</th>
              <th>تعداد</th>
              <th>وزن</th>
              <th>فی</th>
              <th>قیمت</th>
            </tr>
          </thead>
          <tbody>
            {factor.products && factor.products.length > 0
              ? factor.products.map((p, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{p.productName}</td>
                    <td>{p.amount}</td>
                    <td>{p.weight}</td>
                    <td>{<Expense num={p.price} />}</td>
                    <td>{<Expense num={p.price * p.weight} />}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
        <div className="printfullSum">
          <h5>
            <span>صورتحساب</span>
            <span>: </span>
            <span>{factor.ownerName}</span>
            <span> </span>)<span>{factor.isPayed ? "نقدی" : "نسیه"}</span>
            <span>(</span>
            <span> </span>
            <br />
            <span>تاریخ</span>
            <span>: </span>
            <span>{factorDate}</span>
          </h5>
          <div className='fl'>
            <h5>
              <span>جمع کل</span> :<span></span>
              <span> </span>
              <span>{<Expense num={factor.calcs.fullSum} />}</span>
            </h5>
          </div>
          {factor.pays && factor.pays.length > 0 ? (
            <RenderPays pays={factor.pays} />
          ) : (
            <span></span>
          )}
          <div className='fl'>
            <h5>
              <span>قابل پرداخت</span> :<span></span>
              <span> </span>
              <span>{<Expense num={factor.calcs.fullSum - factor.calcs.fullSumPays} />}</span>
            </h5>
          </div>
        </div>
      </div>
      <Footer />
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
      {factors.map((f, index) => (
        <RenderFactor
          key={index}
          index={index}
          factorsLength={factors.length}
          factor={f}
        />
      ))}
    </div>
  ) : (
    <Loading />
  );
}
