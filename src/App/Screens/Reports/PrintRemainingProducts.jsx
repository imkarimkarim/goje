import React, { useState, useRef, useEffect } from "react";
const { ipcRenderer } = require("electron");
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Loading from "../../Components/Loading.jsx";
import Header from "../../Components/Header.jsx";
import Footer from "../../Components/Footer.jsx";
import html2pdf from "html2pdf.js";
import "./PrintRemainingProducts.css";

function RenderProduct({ index, product, productsLength }) {
  const report = useRef(false);
  
  useEffect(() => {
    if (productsLength === index+1 && !report.current) {
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
          window.history.back();
        });
    }    
  })

  return (
    <div className="remainingProduct">
      {product.name == "کارگری" ||
      product.name == "اضافه شود" ||
      product.name == "کرایه" ? (
        <span></span>
      ) : (
        <div className="huh">
          <span>{product.name}</span>
          <span>{product.remainAmount}</span>
        </div>
      )}
    </div>
  );
}

export default function PrintRemainingProducts() {
  const [products, setProducts] = useState();
  const [remainigDetails, setRemainigDetails] = useState([]);
  const init = useRef(true);
  let extractedData = [];

  const sendAllproducts = () => {
    ipcRenderer.send("send-allProducts");
  };

  const sendOneProductCalcs = (productId) => {
    ipcRenderer.send("send-oneProductCalcs", productId);
  };

  const extractRemainingDetails = (productData, calcProduct) => {
    return {
      name: productData.productName,
      remainAmount: productData.amount - calcProduct.SUM_AMOUNT,
      remainWeight: productData.basculeWeight - calcProduct.SUM_KG,
    };
  };

  useEffect(() => {
    if (init.current) {
      sendAllproducts();
      init.current = false;
    }

    ipcRenderer.on("allProducts", (event, dbproducts) => {
      setProducts(dbproducts);
      if (dbproducts && dbproducts.length > 0) {
        for (let i = 0; i < dbproducts.length; i++) {
          (function (ind) {
            setTimeout(function () {
              sendOneProductCalcs(dbproducts[ind].customeId);
            }, 100 + 200 * ind);
          })(i);
        }
      }
    });

    ipcRenderer.on("oneProductCalcs", (event, oneProduct) => {
      if (!remainigDetails || remainigDetails.length === 0) {
        setRemainigDetails([oneProduct]);
      } else {
        setRemainigDetails([...remainigDetails, oneProduct]);
      }
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("allproducts");
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
          return <RenderProduct key={index} product={p} index={index} productsLength={products.length} />;
        })}
      </div>
      <Footer />
    </div>
  ) : (
    <Loading />
  );
}
