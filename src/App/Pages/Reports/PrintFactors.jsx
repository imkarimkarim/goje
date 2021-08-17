import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
const { ipcRenderer } = require("electron");
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Loading from "../../Components/Loading.jsx";
import Expense from "../../Components/Expense.jsx";
import Header from "../../Components/Header.jsx";
import ShowDate from "../../Components/ShowDate.jsx";
import ProductsTable from "../../Components/Factor/ProductsTable.jsx";
import Footer from "../../Components/Footer.jsx";
import NotFound from "../../Components/NotFound.jsx";
import "./PrintFactors.css";
import html2pdf from "html2pdf.js";

// TODO: backuping db, opening db
// TODO: print this + signle print factor

const RenderPays = ({ pays }) => {
  let payDate;
  return (
    <p className="printpaysRecords">
      {pays.map((p, index) => {
        payDate = new JDate(new Date(p.date));
        return (
          <span key={index}>
            <span>{<Expense num={p.amount} />}</span>
            <span> </span>
            <span>پرداخت شد</span>
            <span>)</span>
            <span>{<ShowDate timestamp={p.date} />}</span>
            <span>(</span>
            <br />
          </span>
        );
      })}
    </p>
  );
};

const RenderFactor = ({ factor, index, factorsLength }) => {
  useEffect(() => {
    if (factorsLength === index + 1) {
      const date = new JDate(new Date(factor.factorDate));
      const filename =
        factorsLength !== 1
          ? `گزارش فاکتور های نسیه ${date.date[2]}-${date.date[1]}-${date.date[0]}.pdf`
          : `گزارش ${factor.customeId}`;
      const options = {
        jsPDF: { unit: "cm", format: "a5" },
        filename: filename,
        html2canvas: { scale: 1 },
      };
      html2pdf()
        .set(options)
        .from(document.body)
        .save()
        .then(() => {
          window.history.back();
        });
    }
  });
  let tmpStatus;
  if (factor && factor.isPayed === true) tmpStatus = "نقدی";
  else if (factor && factor.isPayed === false) tmpStatus = "نسیه";
  else if (factor && factor.isPayed === "receipt") tmpStatus = "وصولی";
  return (
    <div className="factorsPrint-wrapper">
      <Header />
      <div className="factorMetaData">
        <div className="name">
          <span>صورتحساب</span>
          <span>: </span>
          <span>
            <h4>{factor.ownerName}</h4>
          </span>
          <span></span>)<span>{tmpStatus}</span>
          <span>(</span>
          <span> </span>
        </div>
        <div className="date">
          <span>تاریخ</span>
          <span> :</span>
          <span>
            {factor && factor.factorDate ? (
              <ShowDate timestamp={factor.factorDate} />
            ) : (
              <span></span>
            )}
          </span>
        </div>
      </div>
      <div className="printProductsTable">
        <table>
          <thead>
            <tr>
              <th>ردیف</th>
              <th>شرح بار</th>
              <th>تعداد</th>
              <th>وزن</th>
              <th>فی</th>
              <th>مبلغ</th>
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
                    <td>
                      {
                        <Expense
                          num={Math.round(100 * (p.price * p.weight)) / 100}
                        />
                      }
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
      <div className="printfullSum">
        {factor.pays && factor.pays.length > 0 ? (
          <RenderPays pays={factor.pays} />
        ) : (
          <span></span>
        )}
        <div className="fl">
          <h5>
            <span>جمع کل</span> :<span></span>
            <span> </span>
            <span>{<Expense num={factor.calcs.fullSum} />}</span>
          </h5>
          <h5 className="imBigger">
            <span>قابل پرداخت</span> :<span></span>
            <span> </span>
            <span>
              {
                <Expense
                  num={factor.calcs.fullSum - factor.calcs.fullSumPays}
                />
              }
            </span>
          </h5>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default function PrintFactors() {
  const [factors, setFactors] = useState();
  let { date, date2 } = useParams();
  date = parseInt(date);
  date2 = parseInt(date2);
  const init = useRef(true);

  const printCreditFactorsByDate = (fromm, till) => {
    ipcRenderer.send("printCreditFactorsByDate", { from: fromm, till: till });
  };

  useEffect(() => {
    if (init.current) {
      printCreditFactorsByDate(date, date2);
      init.current = false;
    }

    ipcRenderer.on("printCreditFactorsByDate", (event, findedFactors) => {
      setFactors(findedFactors);
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("printCreditFactorsByDate");
    };
  });

  if (factors) {
    if (factors.length === 0) {
      return <NotFound />;
    } else {
      return (
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
      );
    }
  } else {
    return <Loading />;
  }
}
