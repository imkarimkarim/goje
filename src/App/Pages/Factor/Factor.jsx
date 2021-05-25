import React, { useState, useRef, useEffect } from "react";
const { ipcRenderer } = require("electron");
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Nav from "../../Components/Nav.jsx";
import Loading from "../../Components/Loading.jsx";
import Conclusion from "../../Components/Factor/Conclusion.jsx";
import Expense from "../../Components/Expense.jsx";
import ProductsTable from "../../Components/Factor/ProductsTable.jsx";
import ShowDate from '../../Components/ShowDate.jsx';
import Pays from "../../Components/Factor/Pays.jsx";
import "./Factor.css";
// TODO: edit
// TODO: $cleanings
// TODO: delete
// TODO: $warning : product is about to finish
// TODO: backup
// TODO: open
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
  let tmpStatus;
  if(factor && factor.isPayed === true) tmpStatus = 'نقدی';
  else if(factor && factor.isPayed === false) tmpStatus = 'نسیه';
  else if(factor && factor.isPayed === 'receipt') tmpStatus = 'وصولی';
  return factor ? (
    <div>
      <Nav title={"/فاکتور/" + factor.customeId} />
      <div className="factor-reports">
        <Grid container spacing={3}>
          <Grid className="header" item xs={12}>
            <div><h3>صورتحساب {factor.ownerName}</h3></div>
            <div>{factor && factor.factorDate ? <ShowDate timestamp={factor.factorDate} /> : <span></span>}</div>
            <div>
              {tmpStatus}
            </div>
          </Grid>
          <Divider />
          <Grid item className="products-section" xs={12}>
            <ProductsTable products={factor.products} />
            <Conclusion products={factor.products} pays={factor.pays} />
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
            <p>(درحال حاضر امکان گزارش گیری تکی برای فاکتور ها وجود ندارد)</p>
            <Button
              disabled={true}
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
