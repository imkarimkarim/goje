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
import ShowDate from "../../Components/ShowDate.jsx";
import "./PrintProducts.css";
import html2pdf from "html2pdf.js";

function InfoSection({ products }) {
  let tmpJdate;
  let tmpJdate2;
  let arrivalDate;
  let finishDate;
  let sumBascule;
  let sumAmount;
  let isProductValid = true;

  if (products) {
    sumBascule = 0;
    sumAmount = 0;
    for (let i = 0; i < products.length; i++) {
      sumAmount += products[i].amount;
      sumBascule += products[i].basculeWeight;
      for (let i2 = 0; i2 < products.length; i2++) {
        if (products[i].owner !== products[i2].owner) {
          isProductValid = false;
        }
      }
    }
  }

  return (
    <div className="info">
      {!isProductValid ? (
        <h1>!در انتخاب صافی دقت کن. اسامی صاحب بارها متفاوت است!</h1>
      ) : (
        <span></span>
      )}
      <p className="safiTitle">
        <span>صورتحساب</span>
        <span> </span>
        <span>
          <h3>{products[0].owner}</h3>
        </span>
        <span>بابت</span>
        <span> </span>
        <span>
          {products.map((p, index) => {
            if (index === 0) {
              return <span key={index}>{p.productName}</span>;
            } else {
              return (
                <span key={index}>
                  <span> ،</span>
                  {p.productName}
                </span>
              );
            }
          })}
        </span>
      </p>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <div className="arrivalDate">
            <span>ورود</span>
            <span> :</span>
            <span>{<ShowDate timestamp={products[0].arrivalDate} />}</span>
          </div>

          <div>
            <span>بستن صافی</span>
            <span> :</span>
            <span>
              {products[0].isProductFinish ? (
                <ShowDate timestamp={products[0].finishDate} />
              ) : (
                "صافی هنوز باز است "
              )}
            </span>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div>
            <span>جمع باسکول</span>
            <span> :</span>
            <span>{sumBascule}</span>
          </div>
          <div>
            <span>جمع تعداد</span>
            <span> :</span>
            <span>{sumAmount}</span>
          </div>
        </Grid>
        <Grid item xs={4}>
          <span>پلاک</span>
          <span> :</span>
          <span>{products[0].plaque}</span>
        </Grid>
      </Grid>
    </div>
  );
}

function SaleSection({ products }) {
  const [salesInfos, setsalesInfos] = useState();
  const init = useRef(true);

  let sumPortage,
    sumUnload,
    sumCash,
    sumCommission,
    sumSaleCommission,
    fullSum,
    sumOwnerEarnings;

  if (salesInfos && products && salesInfos.length === products.length) {
    sumPortage = 0;
    sumUnload = 0;
    sumCash = 0;
    sumCommission = 0;
    sumSaleCommission = 0;
    fullSum = 0;
    sumOwnerEarnings = 0;
    for (let i = 0; i < products.length; i++) {
      sumPortage += products[i].portage;
      sumUnload += products[i].unload;
      sumCash += products[i].cash;
      sumCommission += products[i].commission;
      sumSaleCommission += salesInfos[i].COMMISSION;
      fullSum += salesInfos[i].FULL_SALE;
      sumOwnerEarnings += salesInfos[i].OWNER_ERNINGS;
    }
    sumCommission = sumCommission / salesInfos.length;
  }

  const getOneProductCalcs = (productId) => {
    ipcRenderer.send("getOneProductCalcs", productId);
  };

  useEffect(() => {
    if (init.current) {
      init.current = false;
      for (let i = 0; i < products.length; i++) {
        (function (ind) {
          setTimeout(function () {
            getOneProductCalcs(products[ind].customeId);
          }, 100 + 1000 * ind);
        })(i);
      }
    }

    ipcRenderer.on("oneProductCalcs", (event, product) => {
      if (!salesInfos || salesInfos.length === 0) {
        setsalesInfos([product]);
      } else {
        setsalesInfos([...salesInfos, product]);
      }
    });

    if (salesInfos && products && salesInfos.length === products.length) {
      const date = new JDate(new Date(products[0].arrivalDate));
      const fileName = `صورتحساب ${products[0].owner} ${date.date[2]}-${date.date[1]}-${date.date[0]}.pdf`;
      const options = {
        jsPDF: { format: "a5" },
        filename: fileName,
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

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("oneProductCalcs");
    };
  });

  return salesInfos && products && salesInfos.length === products.length ? (
    <div>
      <div className="sale">
        <Grid container spacing={1}>
          <Grid className="saleInfo-table" item xs={12}>
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
                {salesInfos.map((s, index) => {
                  return (
                    <tr key={index}>
                      <td>{products[index].productName}</td>
                      <td>{s.SUM_AMOUNT}</td>
                      <td>{s.SUM_KG}</td>
                      <td>{<Expense num={s.SALE_AVERAGE} />}</td>
                      <td>{<Expense num={s.FULL_SALE} />}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <span className="fullSomProduct">
              <span>جمع کل</span>
              <span> :</span>
              <span> </span>
              <span>{<Expense num={fullSum} />}</span>
            </span>
          </Grid>
        </Grid>
        <hr />
        <Grid container spacing={1}>
          <Grid className="saleInfo-costs" item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={5}>
                <div>
                  <span>کرایه</span>
                  <span> :</span>
                  <span>{<Expense num={sumPortage} />}</span>
                </div>
                <div>
                  <span>تخلیه</span>
                  <span> :</span>
                  <span>{<Expense num={sumUnload} />}</span>
                </div>
              </Grid>
              <Grid item xs={5}>
                <div>
                  <span>کارمزد</span>
                  <span>)</span>
                  <span>
                    <span>{sumCommission}</span>٪
                  </span>
                  <span>
                    (<span> :</span>
                  </span>
                  <span>{<Expense num={sumSaleCommission} />}</span>
                </div>
                <div>
                  <span>دستی</span>
                  <span> :</span>
                  <span>{<Expense num={sumCash} />}</span>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <div className="owner-earning">
          <h4>
            <span>جمع هزینه‌ها</span>
            <span> :</span>
            <span>
              {
                <Expense
                  num={sumSaleCommission + sumPortage + sumUnload + sumCash}
                />
              }
            </span>
          </h4>
          <h3>
            <span>صافی</span>
            <span> :</span>
            <span>{<Expense num={sumOwnerEarnings} />}</span>
          </h3>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}

export default function PrintProducts() {
  const [products, setProducts] = useState();
  let { ids } = useParams();
  ids = ids.split(",");
  const init = useRef(true);

  const getOneProduct = (id) => {
    ipcRenderer.send("getOneProduct", id);
  };

  useEffect(() => {
    if (init.current) {
      init.current = false;
      for (let i = 0; i < ids.length; i++) {
        (function (ind) {
          setTimeout(function () {
            getOneProduct(ids[ind]);
          }, 100 + 1000 * ind);
        })(i);
      }
    }

    ipcRenderer.on("getOneProduct", (event, product) => {
      if (!products || products.length === 0) {
        setProducts([product]);
      } else {
        setProducts([...products, product]);
      }
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("getOneProduct");
    };
  });

  const sortProductsArray = (producs) => {
    if(!producs) return;
    producs.sort((a, b) => {
      return a.finishDate - b.finishDate;
    }).reverse();
    return producs;
  }

  let sortedProducts;
  if(products && products.length > 0) {
    sortedProducts = sortProductsArray(products);
  }

  return ids && sortedProducts && ids.length === sortedProducts.length ? (
    <div>
      <div className="printProducts">
        <Header />
        <InfoSection products={sortedProducts} />
        <SaleSection products={sortedProducts} />
        <div className="ps">
          <span>پی‌نوشت</span>
          <span> :</span>
          <br />
          {sortedProducts.map((p, index) => {
            return (
              <span key={index}>
                {p.ps ? (
                  <span>
                    {p.ps} <br />
                  </span>
                ) : (
                  ""
                )}
              </span>
            );
          })}
        </div>
        <Footer />
      </div>
    </div>
  ) : (
    <Loading />
  );
}
