import React, { useState, useRef, useEffect, useContext } from "react";
const { ipcRenderer } = require("electron");
import { useParams } from "react-router-dom";
import { NotifContext } from "../../Contexts/NotifContext.jsx";
import JDate from "jalali-date";
import Header from "../../Components/Header.jsx";
import Footer from "../../Components/Footer.jsx";
import Grid from "@material-ui/core/Grid";
import Loading from "../../Components/Loading.jsx";
import Expense from "../../Components/Expense.jsx";
import ShowDate from "../../Components/ShowDate.jsx";
import "./PrintCar.css";
import html2pdf from "html2pdf.js";
import { Redirect } from "react-router-dom";

function InfoSection({ car }) {
  return (
    <div className="info">
      <p className="safiTitle">
        <span>صورتحساب</span>
        <span> </span>
        <span>
          <h3>{car.owner}</h3>
        </span>
      </p>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <div className="ownerId">
            <span>کد صاحب بار</span>
            <span> :</span>
            <span>{car.ownerId}</span>
          </div>
          <div className="arrivalDate">
            <span>تاریخ ورود</span>
            <span> :</span>
            <span>{<ShowDate timestamp={car.arrivalDate} />}</span>
          </div>
          <div>
            <span>تاریخ گزارش</span>
            <span> :</span>
            <span>
              <ShowDate timestamp={car.printDate} />
            </span>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span>کد ماشین</span>
            <span> :</span>
            <span>{car.customeId}</span>
          </div>
          <div>
            <span>پلاک</span>
            <span> :</span>
            <span>{car.plaque}</span>
          </div>
          <div>
            <span>باسکول کل</span>
            <span> :</span>
            <span>{car.basculeWeight}</span>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

function SaleSection({ products, car }) {
  const [salesInfos, setsalesInfos] = useState();
  const [goBack, setGoBack] = useState(false);
  const init = useRef(true);

  let fullSum, sumSaleCommission, fullSumKG;

  if (salesInfos && products && salesInfos.length === products.length) {
    fullSum = 0;
    fullSumKG = 0;
    for (let i = 0; i < products.length; i++) {
      fullSum += salesInfos[i].FULL_SALE;
      fullSumKG += salesInfos[i].SUM_KG;
    }
    sumSaleCommission = Math.floor(fullSum * (car.commission * 0.01));
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
          }, 100 + 500 * ind);
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

    if (
      salesInfos &&
      products &&
      salesInfos.length === products.length &&
      !goBack
    ) {
      const date = new JDate(new Date(car.arrivalDate));
      const fileName = `(${car.customeId}) صورتحساب ${car.owner} ${date.date[2]}-${date.date[1]}-${date.date[0]}.pdf`;
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
          setGoBack(true);
        });
    }

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("oneProductCalcs");
    };
  });

  return salesInfos && products && salesInfos.length === products.length ? (
    <div>
      {goBack ? (
        <Redirect to="/searchCars" />
      ) : (
        <div className="sale">
          <Grid container spacing={1}>
            <Grid className="saleInfo-table" item xs={9}>
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
                <span>جمع کل فروش</span>
                <span> :</span>
                <span> </span>
                <span>{<Expense num={fullSum} />}</span>
              </span>
              <br />
            <span className="fullSomProduct">
              <span>وزن کل</span>
              <span>: </span>
              <span> </span>
              <span>{Math.round(fullSumKG)}</span>
            </span>
            </Grid>
            <Grid className="saleInfo-costs" item xs={3}>
              <div className="rectangle-border">
                <span>کرایه</span>
                <span> :</span>
                <br />
                <span>{<Expense num={car.portage} />}</span>
              </div>
              <div className="rectangle-border">
                <span>تخلیه</span>
                <span> :</span>
                <br />
                <span>{<Expense num={car.unload} />}</span>
              </div>
              <div className="rectangle-border">
                <span>کارمزد</span>
                <span>(</span>
                <span>
                  <span>{car.commission}</span>٪
                </span>
                <span>
                  )<span> :</span>
                </span>
                <br />
                <span>{<Expense num={sumSaleCommission} />}</span>
              </div>
              <div className="rectangle-border">
                <span>دستی</span>
                <span> :</span>
                <br />
                <span>{<Expense num={car.cash} />}</span>
              </div>
              <h4 className="rectangle-border">
                <span>جمع هزینه‌ها</span>
                <span> :</span>
                <br />
                <span>
                  {
                    <Expense
                      num={
                        sumSaleCommission + car.portage + car.unload + car.cash
                      }
                    />
                  }
                </span>
              </h4>
            </Grid>
          </Grid>
          <div className="owner-earning-car">
            <h3>
              <span>صافی</span>
              <span> :</span>
              <span>
                <Expense
                  num={
                    fullSum -
                    (sumSaleCommission + car.portage + car.unload + car.cash)
                  }
                />
              </span>
            </h3>
          </div>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
}

export default function PrintCar({ history }) {
  const [products, setProducts] = useState();
  const [car, setCar] = useState();
  const { clearNotifs } = useContext(NotifContext);
  let { id } = useParams();
  const init = useRef(true);

  const getOneCar = (id) => {
    ipcRenderer.send("getOneCar", id);
  };

  const getOneProduct = (id) => {
    ipcRenderer.send("getOneProduct", id);
  };

  const getInCarProducts = (carId) => {
    ipcRenderer.send("getInCarProducts", carId);
  };

  useEffect(() => {
    if (init.current) {
      clearNotifs();
      init.current = false;
      getOneCar(id);
      getInCarProducts(id);
    }

    ipcRenderer.on("getOneCar", (event, car) => {
      setCar(car);
    });

    ipcRenderer.on("getOneProduct", (event, product) => {
      if (!products || products.length === 0) {
        setProducts([product]);
      } else {
        setProducts([...products, product]);
      }
    });

    ipcRenderer.on("getInCarProducts", (event, inCarProducts) => {
      for (let i = 0; i < inCarProducts.length; i++) {
        (function (ind) {
          setTimeout(function () {
            getOneProduct(inCarProducts[ind].customeId);
          }, 100 + 300 * ind);
        })(i);
      }
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("getOneCar");
      ipcRenderer.removeAllListeners("getOneProduct");
      ipcRenderer.removeAllListeners("getInCarProducts");
    };
  });

  return car && products && products.length === car.products.length ? (
    <div>
      <div className="printCar">
        <Header />
        <InfoSection car={car} />
        <SaleSection history={history} car={car} products={products} />
        {car.ps.length > 0 ? (
          <div className="ps">
            <span>پی‌نوشت</span>
            <span> :</span>
            <br />
            <span>
              <span>
                {car.ps} <br />
              </span>
            </span>
          </div>
        ) : (
          <div></div>
        )}
        <Footer />
      </div>
    </div>
  ) : (
    <Loading />
  );
}
