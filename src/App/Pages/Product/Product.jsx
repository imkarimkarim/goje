import React, { useState, useRef, useEffect } from "react";
const { ipcRenderer } = require("electron");
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import DescriptionIcon from '@material-ui/icons/Description';
import Button from "@material-ui/core/Button";
import Nav from "../../Components/Nav.jsx";
import Loading from "../../Components/Loading.jsx";
import Expense from "../../Components/Expense.jsx";
import ShowDate from "../../Components/ShowDate.jsx";
import "./Product.css";
import html2pdf from "html2pdf.js";
// TODO: add delete button

function InfoSection({ product }) {
  return (
    <div className="info">
      <h3 className="safiTitle">
        صورتحساب {product.owner} بابت {product.productName}
      </h3>
      <Grid container spacing={3}>
        <Grid item xs={7}>
          <div className="customeId">کد بار: {product.customeId}</div>
          <div className="arrivalDate">
            تاریخ ورود: {<ShowDate timestamp={product.arrivalDate} />}
          </div>
          <div className="finishDate">
            تاریخ بستن صافی:
            {product.isProductFinish ? (
              <ShowDate timestamp={product.finishDate} />
            ) : (
              "بار هنوز تمام نشده است "
            )}
          </div>
        </Grid>
        <Grid item xs={5}>
          <div>باسکول: {product.basculeWeight} کیلوگرم</div>
          <div>تعداد: {product.amount}</div>
          <div>پلاک ماشین: {product.plaque}</div>
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
        <Grid container spacing={3}>
          <Grid className="saleInfo-table" item xs={7}>
            <h4>فروش</h4>
            <table>
              <thead>
                <tr>
                  <th>شرح بار</th>
                  <th>تعداد</th>
                  <th>وزن</th>
                  <th>فی فروش</th>
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
          <Grid className="costsInfo" item xs={5}>
            <h4>هزینه‌ها</h4>
            <div>کرایه:‌ {<Expense num={salesInfo.productData.portage} />}</div>
            <div>تخلیه: {<Expense num={salesInfo.productData.unload} />}</div>
            <div>
              کارمزد (٪{salesInfo.productData.commission}):{" "}
              {<Expense num={salesInfo.COMMISSION} />}
            </div>
            <div>دستی: {<Expense num={salesInfo.productData.cash} />}</div>
          </Grid>
        </Grid>
        <div className="owner-earning">
          <h4>
            جمع هزینه‌ها:{" "}
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
          </h4>
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
      <Nav title={"/بار/" + product.customeId} />
      <div className="product-reports">
        <InfoSection product={product} />
        <SaleSection productId={product.customeId} product={product} />
        <div className="ps">
          پی‌نوشت: {product && product.ps ? product.ps : ""}
        </div>
        <div className="actions">
          {product.isProductFinish ? (
            <Link to={`/printProducts/${product.customeId}`}>
              <Button
                className="newProductAddProductInputButton"
                variant="outlined"
                color="primary"
              >
                گزارش تکی<DescriptionIcon />
              </Button>
            </Link>
          ) : (
            <div>(به دلیل تمام نشدن بار گزارش گیری مقدور نیست)</div>
          )}

          <Link to={`/editProduct/${product.customeId}`}>
            <Button
              className="newProductAddProductInputButton"
              variant="outlined"
              color="primary"
            >
              ویرایش
            </Button>
          </Link>
          <Link to={`/productDetails/${product.customeId}`}>
            <Button
              variant="outlined"
              color="primary"
            >
              مشاهده ریز فروش
            </Button>
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
