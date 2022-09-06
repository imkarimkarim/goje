import React, { useState, useRef, useEffect, useContext } from "react";
const { ipcRenderer } = require("electron");
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import DescriptionIcon from "@material-ui/icons/Description";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import Nav from "../../Components/Nav.jsx";
import Loading from "../../Components/Loading.jsx";
import Expense from "../../Components/Expense.jsx";
import ShowDate from "../../Components/ShowDate.jsx";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { PathStackContext } from "../../Contexts/PathStackContext.jsx";
import { NotifContext } from "../../Contexts/NotifContext.jsx";
import { Redirect } from "react-router-dom";
import Cheat from "../../Components/Product/Cheat.jsx";
import "./Product.css";

// TODO: add delete button

function InfoSection({ product }) {
  if (product.inCar) {
    return (
      <div className="info">
        <h3 className="safiTitle">
          <Link to={"/car/" + product.inCar}>
            {product.productName} {product.owner}،{" "}
            {<ShowDate timestamp={product.arrivalDate} />} | ماشین{" "}
            {product.inCar} (برای مشاهده صافی کلیک کنید)
          </Link>
        </h3>
        <br />
        <Grid container spacing={3}>
          <Grid item xs={5}>
            <div className="finishDate">
              وضعیت:
              {product.isProductFinish ? (
                <span className="green-color">
                  تمام شد (<ShowDate timestamp={product.finishDate} />)
                </span>
              ) : (
                <span className="yellow-color"> تمام نشده است</span>
              )}
            </div>
            <div>
              <div>پلاک ماشین: {product.plaque}</div>
            </div>
          </Grid>
          <Grid item xs={5}>
            <div>وزن: {product.basculeWeight} کیلوگرم</div>
            <div>تعداد: {product.amount}</div>
          </Grid>
        </Grid>
      </div>
    );
  } else {
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
}

function SaleSection({ productId, product }) {
  const [salesInfo, setsalesInfo] = useState();
  const init = useRef(true);

  const getOneProductCalcs = (productId) => {
    ipcRenderer.send("getOneProductCalcs", productId);
  };

  useEffect(() => {
    if (init.current) {
      getOneProductCalcs(productId);
    }

    ipcRenderer.on("oneProductCalcs", (event, product) => {
      init.current = false;
      setsalesInfo(product);
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("oneProductCalcs");
    };
  });

  return salesInfo ? (
    product.inCar ? (
      <div>
        <div>
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
          </Grid>
        </div>
      </div>
    ) : (
      <div>
        <div>
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
              <div>
                کرایه:‌ {<Expense num={salesInfo.productData.portage} />}
              </div>
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
    )
  ) : (
    <Loading />
  );
}

export default function Product({ history }) {
  const { pushNotif } = useContext(NotifContext);
  const [product, setProduct] = useState();
  const [countI, setCountI] = useState(0);
  const [isBug, setIsBug] = useState(false);
  const [goBack, setGoBack] = useState(false);
  const { setCurrentPath, getBackPath } = useContext(PathStackContext);

  setCurrentPath(history.location.pathname);

  let { id } = useParams();
  let iidd;
  if (product) {
    iidd = product._id;
  }
  const init = useRef(true);

  const getOneProduct = (id) => {
    ipcRenderer.send("getOneProduct", id);
  };

  const handleRemove = () => {
    ipcRenderer.send("isProductHasDependency", id);
  };

  const removeProduct = (iidd) => {
    ipcRenderer.send("removeProductById", iidd);
  };

  const isProductBug = (productId, carId) => {
    ipcRenderer.send("isProductBug", { productId: productId, carId: carId });
  };

  const toggleProductFinish = (id) => {
    ipcRenderer.send("toggleProductFinish", id);
  };

  const handleKeyBoardEvent = (e) => {
    if (e.key === "I" || e.key === "i" || e.key === "ه" || e.key === "ّ")
      setCountI(countI + 1);
    if (e.key === "Escape") setCountI(0);
  };

  useEffect(() => {
    if (countI === -1) {
      setProduct();
      getOneProduct(id);
    }
  }, [countI]);

  useEffect(() => {
    if (init.current) {
      getOneProduct(id);
      init.current = false;
    }

    document.addEventListener("keydown", handleKeyBoardEvent);

    ipcRenderer.on("getOneProduct", (event, product) => {
      setProduct(product);
      isProductBug(product.customeId, product.inCar);
    });

    ipcRenderer.on("isProductHasDependency", (event, dependencyStatus) => {
      if (dependencyStatus.status === true) {
        pushNotif("error", dependencyStatus.message);
      } else if (dependencyStatus.status === false) {
        removeProduct(iidd);
        setGoBack(true);
      }
    });

    ipcRenderer.on("isProductBug", (event, bool) => {
      setIsBug(bool);
    });

    // clean up
    return () => {
      document.removeEventListener("keydown", handleKeyBoardEvent);
      ipcRenderer.removeAllListeners("getOneProduct");
      ipcRenderer.removeAllListeners("isProductBug");
      ipcRenderer.removeAllListeners("isProductHasDependency");
    };
  });

  return goBack ? (
    <Redirect to={getBackPath()} />
  ) : product ? (
    product.inCar ? (
      <div>
        {countI > 4 ? (
          <Cheat setCountI={setCountI} productId={product.customeId} />
        ) : (
          <div></div>
        )}
        <Nav history={history} />
        <div className="product-reports">
          <br />
          <InfoSection product={product} />
          <SaleSection productId={product.customeId} product={product} />
          <br />
          {isBug === true ? (
            <p className="red-color">
              این بار به دلیل نقص سیستمی ایجاد شده است لطفا پس از انتقال وابستگی
              ها آنرا حذف کنید
            </p>
          ) : (
            <div></div>
          )}
          <div className="actions">
            {isBug === true ? (
              <Button
                className="deleteCheats"
                onClick={handleRemove}
                variant="outlined"
                color="secondary"
              >
                حذف
              </Button>
            ) : (
              <div></div>
            )}
            <Link to={`/productDetails/${product.customeId}`}>
              <Button variant="outlined" color="primary">
                مشاهده ریز فروش
              </Button>
            </Link>
            <FormControlLabel
              className="toggleProductFinish"
              control={
                <Switch
                  checked={product.isProductFinish}
                  onChange={() => {
                    toggleProductFinish(product._id);
                    setProduct({});
                    init.current = true;
                  }}
                />
              }
              label="اتمام بار:"
              labelPlacement="start"
            />
          </div>
        </div>
      </div>
    ) : (
      <div>
        {countI > 4 ? (
          <Cheat setCountI={setCountI} productId={product.customeId} />
        ) : (
          <div></div>
        )}
        <Nav history={history} />
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
                  گزارش تکی
                  <DescriptionIcon />
                </Button>
              </Link>
            ) : (
              <div className="red-color">
                (به دلیل تمام نشدن بار گزارش گیری مقدور نیست)
              </div>
            )}

            <Link to={`/editProduct/${product.customeId}`}>
              <Button
                className="newProductAddProductInputButton"
                variant="outlined"
                color="primary"
              >
                ویرایش <EditIcon />
              </Button>
            </Link>
            <Link to={`/productDetails/${product.customeId}`}>
              <Button variant="outlined" color="primary">
                مشاهده ریز فروش
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  ) : (
    <Loading />
  );
}
