import React, { useState, useRef, useEffect } from "react";
const { ipcRenderer } = require("electron");
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Nav from "../Nav.jsx";
import Loading from "../Loading.jsx";
import Expense from "../Expense.jsx";
import ProductsTable from "../Product/ProductsTable.jsx";
import ShowDate from '../ShowDate.jsx'; 
import Pays from "../Pays.jsx";
import "./Factor.css";
// TODO: edit
// TODO: $cleanings
// TODO: style
// TODO: delete
// TODO: close proudct
// TODO: $warning : product is about to finish
// TODO: لیست حسابدار
// TODO: print
// TODO: print changes
// TODO: print todays
// TODO: last schema
// TODO: backup
// TODO: open
// TODO: key
// TODO: add delete button

// TODO: installer
// TODO: test + test on windows

const factorSchema = {
  docType: "factor",
  owner: "",
  ownerName: "",
  customeId: "",
  isPayed: "",
  factorDate: 0,
  changeDate: 0,
  products: [],
  calcs: [],
  pays: [],
  id: ''
};

export default function Factor() {
  const [factor, setFactor] = useState(factorSchema);
  let { id } = useParams();
  const init = useRef(true);

  const sendOneFactor = (id) => {
    ipcRenderer.send("send-oneFactor", id);
  };
  useEffect(() => {
    if (init.current) {
      sendOneFactor(id);
      ipcRenderer.on("send-oneFactor", (event, oneFactor) => {
        init.current = false;
        setFactor(oneFactor);
      });
    }
    
    // clean up
    return () => {
      ipcRenderer.removeAllListeners("send-oneFactor");
    };
  });

  let factorDate;
  let tmpJdate;
  if (factor && factor.factorDate) {
    tmpJdate = new JDate(new Date(factor.factorDate));
    factorDate = tmpJdate.format("dddd DD MMMM YYYY");
  }

  return factor ? (
    <div>
      <Nav title={"/فاکتور/" + factor.customeId} />
      <div className="factor-reports">
        <Grid container spacing={3}>
          <Grid className="header" item xs={12}>
            <div><h3>صورتحساب {factor.ownerName}</h3></div>
            <div>{factor && factor.factorDate ? <ShowDate timestamp={factor.factorDate} /> : <span></span>}</div>
            <div>{factor && factor.isPayed ? 'نقدی' : 'نسیه'}</div>
          </Grid>
          <Divider />
          <Grid item className="products-section" xs={12}>
            <ProductsTable pays={factor.pays} products={factor.products} />
          </Grid>
          <Divider />
          {factor && factor.pays && factor.pays.length > 0 ? (
            <Grid item className="addpay-section" xs={12}>
              <Pays pays={factor.pays} />
            </Grid>
          ) : (
            <div></div>
          )}
          <div className="actions">
            <Button
              className="newFactorAddProductInputButton"
              variant="outlined"
              color="primary"
            >
              گزارش
            </Button>
            <Link to={`/editFactor/${factor.customeId}`}>
              <Button
                className="newFactorAddProductInputButton"
                variant="outlined"
                color="primary"
              >
                ویرایش
              </Button>
            </Link>
          </div>
        </Grid>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
