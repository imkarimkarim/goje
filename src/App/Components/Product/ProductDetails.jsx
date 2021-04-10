import React, { useState, useRef, useEffect } from "react";
const { ipcRenderer } = require("electron");
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import JDate from "jalali-date";
import SearchResultItem from "../../Components/SearchResultItem.jsx";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Nav from "../Nav.jsx";
import Expense from '../Expense.jsx';
import Loading from "../Loading.jsx";
import ShowDate from "../ShowDate.jsx";

export default function ProductDetails() {
  const [factorsWithProduct, setFactorsWithProduct] = useState();
  let { id } = useParams();
  const init = useRef(true);

  const sendProductDetails = (id) => {
    ipcRenderer.send("oneProductDetails", id);
  };

  useEffect(() => {
    if (init.current) {
      sendProductDetails(id);
    }

    ipcRenderer.on("oneProductDetails", (event, productDetails) => {
      init.current = false;
      setFactorsWithProduct(productDetails);
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("oneProductDetails");
    };
  });

  let filteredProducts = [];
  if (factorsWithProduct && factorsWithProduct.length > 0) {
    for (let i = 0; i < factorsWithProduct.length; i++) {
      for (let i2 = 0; i2 < factorsWithProduct[i].products.length; i2++) {
        if (factorsWithProduct[i].products[i2].productId === id) {
          filteredProducts.push({
            factor: [
              factorsWithProduct[i].ownerName,
              factorsWithProduct[i].factorDate,
              factorsWithProduct[i].customeId,
            ],
            product: factorsWithProduct[i].products[i2],
          });
        }
      }
    }
  }

  let resultsList;
  if (filteredProducts) {
    resultsList = filteredProducts.map((p) => {
      return (
        <div key={p.factor[2]}>
          <SearchResultItem
            itemTitle={
              <span>
                {p.factor[0] + ': ' + p.product.productName + ' ' +
                p.product.amount + ' ' + p.product.weight + ' ' + " "}
                <span>
                  <Expense num={p.product.price} />
                </span>
              </span>
            }
            titleHint={
              <span>
                <ShowDate timestamp={p.factor[1]} />
              </span>
            }
            customeId={p.factor[2]}
            to={`/factor/${p.factor[2]}`}
          />
        </div>
      );
    });
  }

  return (
    <div>
      <Nav title={"/ریزفروش/" + id} />
      <div className="product-details">
        <h3>ریز فروش {id}</h3>
        <List>
          {resultsList && resultsList.length >= 0 ? resultsList : <Loading />}
        </List>
      </div>
    </div>
  );
}
