import React, { useState, useRef, useEffect } from "react";
const { ipcRenderer } = require("electron");
import { useParams } from "react-router-dom";
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Nav from "../Nav.jsx";
import Loading from "../Loading.jsx";
import Expense from "../Expense.jsx";
import "./ProductReports.css";

function InfoSection({ product }) {
  let tmpJdate;
  let arrivalDate;
  if (product) {
    tmpJdate = new JDate(new Date(product.arrivalDate));
    arrivalDate = tmpJdate.format("dddd DD MMMM YYYY");
  }

  if (product && product.isProductFinish) {
    tmpJdate = new JDate(product.finishDate.date);
    finishDate = tmpJdate.format("dddd DD MMMM YYYY");
  }

  return (
    <div className="info">
      <h3>
        اطلاعات بار <Divider />
      </h3>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <div className="customeId">کد بار: {product.customeId}</div>
          <div className="name">شرح بار: {product.productName}</div>
          <div className="owner">صاحب بار: {product.owner}</div>
          <div className="arrivalDate">تاریخ ورود: {arrivalDate}</div>
          <div className="finishDate">
            تاریخ بستن صافی:
            {product.isProductFinish ? finishDate : "صافی هنوز باز است"}
          </div>
        </Grid>
        <Grid item xs={4}>
          <div>باسکول: {product.basculeWeight} کیلوگرم</div>
          <div>تعداد: {product.amount}</div>
          <div>پلاک ماشین: {product.plaque}</div>
        </Grid>
      </Grid>
    </div>
  );
}

function SaleSection({ productId }) {
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

  return salesInfo ? (
    <div>
      <div className="sale">
        <h3>
          فروش <Divider />
        </h3>
        <div>{salesInfo.SUM_AMOUNT} عدد</div>
        <div>{salesInfo.SUM_KG} کیلوگرم</div>
        <div>میانگین فی فروش: {<Expense num={salesInfo.SALE_AVERAGE} />}</div>
        <div>مبلغ کل فروش: {<Expense num={salesInfo.FULL_SALE} />}</div>

        <h3>
          صافی <Divider />
        </h3>
        <div>کرایه:‌ {<Expense num={salesInfo.productData.portage} />}</div>
        <div>تخلیه: {<Expense num={salesInfo.productData.unload} />}</div>
        <div>
          کارمزد (٪{salesInfo.productData.commission}):{" "}
          {<Expense num={salesInfo.COMMISSION} />}
        </div>
        <div>دستی: {<Expense num={salesInfo.productData.cash} />}</div>
        <div className="owner-earning">
          <h3>صافی: {<Expense num={salesInfo.OWNER_ERNINGS} />}</h3>
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
      <Nav title={"گزارش گیری/صافی ها/" + product.customeId} />
      <div className="product-reports">
        <InfoSection product={product} />
        <SaleSection productId={product.customeId} />
      </div>
    </div>
  ) : (
    <Loading />
  );
}
