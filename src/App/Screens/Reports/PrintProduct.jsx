import React, { useState, useRef, useEffect } from "react";
const { ipcRenderer } = require("electron");
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Loading from "../../Components/Loading.jsx";
import Expense from "../../Components/Expense.jsx";
import Header from "../../Components/Header.jsx";
import Footer from "../../Components/Footer.jsx";
import "./PrintProduct.css";
import html2pdf from "html2pdf.js";

function InfoSection({ product }) {
  let tmpJdate;
  let tmpJdate2;
  let arrivalDate;
  let finishDate;
  if (product) {
    tmpJdate = new JDate(new Date(product.arrivalDate));
    arrivalDate = tmpJdate.format("dddd DD MMMM YYYY");
  }

  if (product && product.isProductFinish) {
    tmpJdate2 = new JDate(new Date(product.finishDate));
    finishDate = tmpJdate2.format("dddd DD MMMM YYYY");
  }

  return (
    <div className="info">
      <h3 className="safiTitle">
        <span> صورتحساب</span>
        <span>{product.owner} </span>
        <span> بابت </span>
        <span>{product.productName}</span>
      </h3>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <div className="customeId">
            <span>کدبار</span>
            <span> :</span>
            <span>{product.customeId}</span>
          </div>

          <div className="arrivalDate">
            <span>تاریخ ورود</span>
            <span> :</span>
            <span>{arrivalDate}</span>
          </div>

          <div cl="finishDate">
            <span>تاریخ بستن صافی</span>
            <span> :</span>
            <span>
              {product.isProductFinish ? finishDate : "صافی هنوز باز است "}
            </span>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div>
            <span>باسکول</span>
            <span> :</span>
            <span>{product.basculeWeight}</span>
            <span>کیلوگرم</span>
          </div>
          <div>
            <span>تعداد</span>
            <span> :</span>
            <span>{product.amount}</span>
          </div>
          <span>پلاک ماشین</span>
          <span> :</span>
          <span>{product.plaque}</span>
        </Grid>
      </Grid>
    </div>
  );
}

function SaleSection({ productId, product }) {
  const [salesInfo, setsalesInfo] = useState();
  const init = useRef(true);

  const sendOneProductCalcs = (productId) => {
    ipcRenderer.send("send-oneProductCalcs", productId);
  };

  useEffect(() => {
    if (init.current) {
      sendOneProductCalcs(productId);
    }

    ipcRenderer.on("oneProductCalcs", (event, oneProduct) => {
      init.current = false;
      setsalesInfo(oneProduct);
      let opt = {
        margin: 1,
        filename: "product.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      html2pdf(document.body);
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("oneProductCalcs");
    };
  });

  return salesInfo ? (
    <div>
      <div className="sale">
        <Grid container spacing={3}>
          <Grid className="saleInfo-table" item xs={8}>
            <h4>فروش</h4>
            <table>
              <thead>
                <tr>
                  <th>شرح بار</th>
                  <th>تعداد</th>
                  <th>وزن</th>
                  <th>میانگین فی</th>
                  <th>مبلغ کل</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{product.productName}</td>
                  <td>{salesInfo.SUM_AMOUNT}</td>
                  <td>{salesInfo.SUM_KG}</td>
                  <td>{<Expense num={salesInfo.SALE_AVERAGE} />}</td>
                  <td>{<Expense num={salesInfo.FULL_SALE} />}</td>
                </tr>
              </tbody>
            </table>
          </Grid>
          <Grid className="costsInfo" item xs={4}>
            <h4>هزینه‌ها</h4>

            <div>
              <span>کرایه</span>
              <span> :</span>
              <span>{<Expense num={salesInfo.productData.portage} />}</span>
            </div>
            <div>
              <span>تخلیه</span>
              <span> :</span>
              <span>{<Expense num={salesInfo.productData.unload} />}</span>
            </div>
            <div>
              <span>کارمزد</span>
              <span>)</span>
              <span>
                <span>{salesInfo.productData.commission}</span>٪
              </span>
              <span>
                (<span> :</span>
              </span>
              <span>{<Expense num={salesInfo.COMMISSION} />}</span>
            </div>
            <div>
              <span>دستی</span>
              <span> :</span>
              <span>{<Expense num={salesInfo.productData.cash} />}</span>
            </div>
          </Grid>
        </Grid>
        <div className="owner-earning">
          <h4>
            <span>جمع هزینه‌ها</span>
            <span> :</span>
            <span>
              {
                <Expense
                  num={
                    salesInfo.COMMISSION +
                    salesInfo.productData.portage +
                    salesInfo.productData.unload +
                    salesInfo.productData.cash
                  }
                />
              }
            </span>
          </h4>
          <h3>
            <span>صافی</span>
            <span> :</span>
            <span>{<Expense num={salesInfo.OWNER_ERNINGS} />}</span>
          </h3>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}

export default function ProductReports() {
  const [product, setProduct] = useState();
  let { id } = useParams();
  const init = useRef(true);
  const [loading, setLoading] = useState(true);

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

  return product ? (
    <div>
      <div className="printProduct">
        <Header />
        <InfoSection product={product} />
        <SaleSection productId={product.customeId} product={product} />
        <Footer />
      </div>
    </div>
  ) : (
    <Loading />
  );
}
