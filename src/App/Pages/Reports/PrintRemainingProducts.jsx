import React, { useState, useRef, useEffect, useContext } from "react";
const { ipcRenderer } = require("electron");
import { PathStackContext } from "../../Contexts/PathStackContext.jsx";
import { NotifContext } from "../../Contexts/NotifContext.jsx";
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Loading from "../../Components/Loading.jsx";
import Header from "../../Components/Header.jsx";
import Footer from "../../Components/Footer.jsx";
import html2pdf from "html2pdf.js";
import { Redirect } from "react-router-dom";
import "./PrintRemainingProducts.css";

function RenderProduct({ index, product, productsLength, history }) {
  const [goBack, setGoBack] = useState(false);
  const report = useRef(false);
  const { setCurrentPath, getBackPath } = useContext(PathStackContext);

  setCurrentPath(history.location.pathname);

  useEffect(() => {
    if (productsLength === index + 1 && !report.current && !goBack) {
      report.current = true;
      const date = new JDate();
      const fileName = `باقیمانده بار ${date.date[2]}-${date.date[1]}-${date.date[0]}.pdf`;
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
  });

  return (
    <div>
      {goBack ? (
        <Redirect to={getBackPath()} />
      ) : (
        <div className="remainingProduct">
          {product.name == "کارگری" ||
          product.name == "اضافه شود" ||
          product.name == "پول" ||
          product.name == "کرایه" ? (
            <span></span>
          ) : (
            <div className="huh">
              <span>{product.name}</span>
              <span> </span>
              <span>{product.owner}</span>
              <span>:</span>
              <span>{product.remainAmount}</span>
              <span>عدد</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PrintRemainingProducts({ history }) {
  const [products, setProducts] = useState();
  const [remainigDetails, setRemainigDetails] = useState([]);
  const init = useRef(true);
  const { clearNotifs } = useContext(NotifContext);
  let extractedData = [];

  const getUnFinishedProducts = () => {
    ipcRenderer.send("getUnFinishedProducts");
  };

  const getOneProductCalcs = (productId) => {
    ipcRenderer.send("getOneProductCalcs", productId);
  };

  const extractRemainingDetails = (productData, calcProduct) => {
    return {
      name: productData.productName,
      owner: productData.owner,
      remainAmount: productData.amount - calcProduct.SUM_AMOUNT,
      remainWeight: productData.basculeWeight - calcProduct.SUM_KG,
    };
  };

  useEffect(() => {
    if (init.current) {
      clearNotifs();
      getUnFinishedProducts();
      init.current = false;
    }

    ipcRenderer.on("getUnFinishedProducts", (event, dbproducts) => {
      setProducts(dbproducts);
      if (dbproducts && dbproducts.length > 0) {
        for (let i = 0; i < dbproducts.length; i++) {
          (function (ind) {
            setTimeout(function () {
              getOneProductCalcs(dbproducts[ind].customeId);
            }, 100 + 1000 * ind);
          })(i);
        }
      }
    });

    ipcRenderer.on("oneProductCalcs", (event, product) => {
      if (!remainigDetails || remainigDetails.length === 0) {
        setRemainigDetails([product]);
      } else {
        setRemainigDetails([...remainigDetails, product]);
      }
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("getUnFinishedProducts");
      ipcRenderer.removeAllListeners("oneProductCalcs");
    };
  });
  if (
    products &&
    products.length > 0 &&
    remainigDetails &&
    remainigDetails.length > 0 &&
    products.length === remainigDetails.length
  ) {
    extractedData = [];
    for (let i = 0; i < products.length; i++) {
      extractedData.push(
        extractRemainingDetails(products[i], remainigDetails[i])
      );
    }
  }

  const jdate = new JDate();
  const stringDate = jdate.format("dddd DD MMMM YYYY");

  return extractedData &&
    extractedData.length > 0 &&
    extractedData.length === products.length ? (
    <div className="remainingProductsOuterContainer">
      <Header />
      <h4>باقیمانده بار {stringDate}</h4>
      <div className="remainingProducts">
        {extractedData.map((p, index) => {
          return (
            <RenderProduct
              history={history}
              key={index}
              product={p}
              index={index}
              productsLength={products.length}
            />
          );
        })}
      </div>
      <Footer />
    </div>
  ) : (
    <Loading />
  );
}
