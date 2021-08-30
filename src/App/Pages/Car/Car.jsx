import React, { useState, useRef, useEffect } from "react";
const { ipcRenderer } = require("electron");
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import Loading from "../../Components/Loading.jsx";
import DoneIcon from "@material-ui/icons/Done";
import DescriptionIcon from "@material-ui/icons/Description";
import Expense from "../../Components/Expense.jsx";
import ShowDate from "../../Components/ShowDate.jsx";
import Nav from "../../Components/Nav.jsx";
import { productsToString, isRangeOk } from "../../utils.js";
import "./Car.css";

function InfoSection({ car }) {
  return (
    <div className="info">
      <p className="car-safiTitle">
        <span>صورتحساب</span>
        <span> </span>
        <span>
          <h3>{car.owner}</h3>
        </span>
      </p>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <div className="owner">
            <span>کد صاحب بار</span>
            <span>: </span>
            <span>{car.ownerId}</span>
          </div>
          <div className="arrivalDate">
            <span>ورود</span>
            <span>: </span>
            <span>{<ShowDate timestamp={car.arrivalDate} />}</span>
          </div>

          <div>
            <span>وضعیت</span>
            <span>: </span>
            <span>
              {car.isPrinted ? (
                <span className="green-color">
                  گزارش گرفته شد(
                  <ShowDate timestamp={car.printDate} />)
                </span>
              ) : (
                <span className="yellow-color"> گزارش گرفته نشده است</span>
              )}
            </span>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div>
            <span>پلاک</span>
            <span>: </span>
            <span>{car.plaque}</span>
          </div>
          <div>
            <span>کد ماشین</span>
            <span>: </span>
            <span>{car.customeId}</span>
          </div>
          <div>
            <span>باسکول کل</span>
            <span>: </span>
            <span>{car.basculeWeight}</span>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

function SaleSection({ products, car }) {
  const [salesInfos, setsalesInfos] = useState();
  const init = useRef(true);

  const getOneProductCalcs = (productId) => {
    ipcRenderer.send("getOneProductCalcs", productId);
  };

  let fullSum, sumSaleCommission;

  if (salesInfos && products && salesInfos.length === products.length) {
    fullSum = 0;
    for (let i = 0; i < products.length; i++) {
      fullSum += salesInfos[i].FULL_SALE;
    }
    sumSaleCommission = Math.floor(fullSum * (car.commission * 0.01));
  }

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

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("oneProductCalcs");
    };
  });

  return salesInfos && products && salesInfos.length === products.length ? (
    <div>
      <div className="sale">
        <Grid container spacing={1}>
          <Grid className="saleInfo-table" item xs={8}>
            <table>
              <thead>
                <tr>
                  <th>اتمام</th>
                  <th>شرح بار</th>
                  <th>تعداد</th>
                  <th>وزن</th>
                  <th>فی فروش</th>
                  <th>مبلغ کل</th>
                </tr>
              </thead>
              <tbody>
                {salesInfos.map((s, index) => {
                  let color;
                  // turn the record color to red if amount or weight for sale are out of range
                  if (products[index].basculeWeight !== 0) {
                    if (
                      !isRangeOk(
                        salesInfos[index].SUM_KG,
                        products[index].basculeWeight - 99,
                        products[index].basculeWeight
                      )
                    ) {
                      color = "red";
                    }
                  }
                  if (products[index].amount !== 0) {
                    if (
                      !isRangeOk(
                        salesInfos[index].SUM_AMOUNT,
                        products[index].amount,
                        products[index].amount
                      )
                    ) {
                      color = "red";
                    }
                  }

                  return (
                    <tr key={index}>
                      <td>
                        {products[index].isProductFinish ? (
                          <DoneIcon style={{ color: "green" }} />
                        ) : (
                          <span></span>
                        )}
                      </td>
                      <td>
                        <Link to={"/product/" + products[index].customeId}>
                          <span className={color + "-color"}>
                            {products[index].productName}
                          </span>
                        </Link>
                      </td>
                      <td>
                        <span className={color + "-color"}>
                          <span className="hint">
                            ({products[index].amount})
                          </span>
                          {"  " + s.SUM_AMOUNT}
                        </span>
                      </td>
                      <td>
                        <span className={color + "-color"}>
                          <span className="hint">
                            ({products[index].basculeWeight})
                          </span>
                          {"  " + s.SUM_KG}
                        </span>
                      </td>
                      <td>
                        <span className={color + "-color"}>
                          {<Expense num={s.SALE_AVERAGE} />}
                        </span>
                      </td>
                      <td>
                        <span className={color + "-color"}>
                          {<Expense num={s.FULL_SALE} />}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <span className="fullSomProduct">
              <span>جمع کل</span>
              <span>: </span>
              <span> </span>
              <span>{<Expense num={fullSum} />}</span>
            </span>
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={3}>
              <div className="saleInfo-costs-car">
                <div>
                  <span>کرایه</span>
                  <span>: </span>
                  <span>{<Expense num={car.portage} />}</span>
                </div>
                <div>
                  <span>تخلیه</span>
                  <span>: </span>
                  <span>{<Expense num={car.unload} />}</span>
                </div>
                <div>
                  <span>کارمزد</span>
                  <span>(</span>
                  <span>
                    <span>{car.commission}</span>٪
                  </span>
                  <span>
                    )<span>: </span>
                  </span>
                  <span>{<Expense num={sumSaleCommission} />}</span>
                </div>
                <div>
                  <span>دستی</span>
                  <span>: </span>
                  <span>{<Expense num={car.cash} />}</span>
                </div>
                <h4>
                  <span>جمع هزینه‌ها</span>
                  <span>: </span>
                  <span>
                    {
                      <Expense
                        num={
                          sumSaleCommission +
                          car.portage +
                          car.unload +
                          car.cash
                        }
                      />
                    }
                  </span>
                </h4>
              </div>
            </Grid>
          </Grid>
        </Grid>

        <div className="owner-earning-car">
          <h3>
            <span>صافی</span>
            <span>: </span>
            <span>
              {fullSum -
                (sumSaleCommission + car.portage + car.unload + car.cash) >
              0 ? (
                <span>
                  <Expense
                    num={
                      fullSum -
                      (sumSaleCommission + car.portage + car.unload + car.cash)
                    }
                  />
                </span>
              ) : (
                <span className="red-color">
                  <Expense
                    num={
                      fullSum -
                      (sumSaleCommission + car.portage + car.unload + car.cash)
                    }
                  />
                </span>
              )}
            </span>
          </h3>
        </div>
        <hr />
      </div>
    </div>
  ) : (
    <Loading />
  );
}

const Car = ({ history }) => {
  const [products, setProducts] = useState();
  const [car, setCar] = useState();
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

  const toggleCarFinish = (id) => {
    ipcRenderer.send("toggleCarFinish", id);
  };

  useEffect(() => {
    if (init.current) {
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
      ipcRenderer.removeAllListeners("toggleCarFinish");
    };
  });

  let isPrintable = true;
  if (products && products.length > 0) {
    for (let i = 0; i < products.length; i++) {
      if (products[i].isProductFinish === false) {
        isPrintable = false;
      }
    }
  }

  return (car && products && products.length === car.products.length) ||
    (car && products && products.length > car.products.length) ? (
    <div>
      <Nav history={history} />
      <div className="car">
        <InfoSection car={car} />
        <SaleSection products={products} car={car} />
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
        <Link to={`/editCar/${car.customeId}`}>
          <Button
            className="newProductAddProductInputButton"
            variant="outlined"
            color="primary"
          >
            ویرایش <EditIcon />
          </Button>
        </Link>
        {isPrintable ? (
          <Link
            onClick={() => {
              toggleCarFinish(car._id);
            }}
            to={`/printCar/${car.customeId}`}
          >
            <Button
              className="newProductAddProductInputButton"
              variant="outlined"
              color="primary"
            >
              گزارش
              <DescriptionIcon />
            </Button>
          </Link>
        ) : (
          <div className="red-color">
            (به دلیل تمام نشدن تمام بارها گزارش گیری مقدور نیست)
          </div>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Car;
