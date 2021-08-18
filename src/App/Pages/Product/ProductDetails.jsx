import React, { useState, useRef, useEffect } from "react";
const { ipcRenderer } = require("electron");
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import JDate from "jalali-date";
import SearchResultItem from "../../Components/Report/SearchResultItem.jsx";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Nav from "../../Components/Nav.jsx";
import Expense from "../../Components/Expense.jsx";
import Loading from "../../Components/Loading.jsx";
import ShowDate from "../../Components/ShowDate.jsx";
import { conflictFinder } from "../../../modules/conflictFinder.js";
import "./ProductDetails.css";

export default function ProductDetails() {
  const [factorsWithProduct, setFactorsWithProduct] = useState();
  let { id } = useParams();
  const init = useRef(true);

  const getOneProductDetails = (id) => {
    ipcRenderer.send("getOneProductDetails", id);
  };

  useEffect(() => {
    if (init.current) {
      getOneProductDetails(id);
    }

    ipcRenderer.on("getOneProductDetails", (event, productDetails) => {
      init.current = false;
      setFactorsWithProduct(productDetails);
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("getOneProductDetails");
    };
  });

  let filteredProducts = [];
  if (factorsWithProduct && factorsWithProduct.length > 0) {
    for (let i = 0; i < factorsWithProduct.length; i++) {
      for (let i2 = 0; i2 < factorsWithProduct[i].products.length; i2++) {
        if (factorsWithProduct[i].products[i2].productId === id) {
          filteredProducts = [
            ...filteredProducts,
            {
              factor: {
                ownerName: factorsWithProduct[i].ownerName,
                factorDate: factorsWithProduct[i].factorDate,
                customeId: factorsWithProduct[i].customeId,
              },
              product: factorsWithProduct[i].products[i2],
            },
          ];
        }
      }
    }
  }

  if (filteredProducts.length > 5) {
    filteredProducts = conflictFinder(filteredProducts);
  }

  let resultsList;
  if (filteredProducts) {
    resultsList = filteredProducts.map((p) => {
      return (
        <div className="recordWrapper" key={p.factor.customeId}>
          <SearchResultItem
            itemTitle={
              <div className={"record " + p.className}>
                <div>{p.factor.ownerName}</div>
                <div>{p.product.productName}</div>
                <div>
                  <span className="hint">تعداد:</span>
                  {p.product.amount}
                </div>
                <div>
                  <span className="hint">وزن:</span>
                  {p.product.weight}
                </div>
                <div>
                  <Expense num={p.product.price} />
                </div>
                <div>
                  <ShowDate timestamp={p.factor.factorDate} />
                </div>
              </div>
            }
            customeId={p.factor.customeId}
            to={`/factor/${p.factor.customeId}`}
          />
        </div>
      );
    });
  }

  return (
    <div>
      <Nav title={"/ریزفروش/" + id} />
      <div className="product-details">
        {resultsList.length > 5 ? (
          <h3>
            ریز فروش {id} | (سیستم خطایابی{" "}
            <span className="green-color">فعال است!</span> ردیف های با رنگ زرد
            یا قرمز احتمال وجود خطا در ورود فاکتور را نمایان میکنید اما فراموش
            نکنید که سیستم خطایابی فقط یک دستیار کاربر است و نه بیشتر)
          </h3>
        ) : (
          <h3>
            ریز فروش {id} | (سیستم خطایابی به دلیل کافی نبودن ردیف ها{" "}
            <span className="red-color">غیرفعال است!</span> لطفا به صورت دستی بررسی کنید)
          </h3>
        )}

        <List>
          {resultsList && resultsList.length >= 0 ? resultsList : <Loading />}
        </List>
      </div>
    </div>
  );
}
