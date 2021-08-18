import React, { useState, useRef, useEffect } from "react";
const { ipcRenderer } = require("electron");
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import Nav from "../../Components/Nav.jsx";
import Loading from "../../Components/Loading.jsx";
import Conclusion from "../../Components/Factor/Conclusion.jsx";
import Expense from "../../Components/Expense.jsx";
import FactorProductsTable from "../../Components/Factor/FactorProductsTable.jsx";
import ShowDate from "../../Components/ShowDate.jsx";
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

export default function Factor() {
  const [factor, setFactor] = useState({});
  let { id } = useParams();
  const init = useRef(true);

  const getOneFactor = (id) => {
    ipcRenderer.send("getOneFactor", id);
  };
  useEffect(() => {
    if (init.current) {
      getOneFactor(id);
      ipcRenderer.on("getOneFactor", (event, oneFactor) => {
        init.current = false;
        setFactor(oneFactor);
      });
    }

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("getOneFactor");
    };
  });
  let tmpStatus;
  if (factor && factor.isPayed === true) tmpStatus = "نقدی";
  else if (factor && factor.isPayed === false) tmpStatus = "نسیه";
  else if (factor && factor.isPayed === "receipt") tmpStatus = "وصولی";
  return factor ? (
    <div>
      <Nav />
      <div className="factor-reports goje-container">
        <Grid container spacing={3}>
          <Grid className="header" item xs={12}>
            <div>
              <h3>صورتحساب {factor.ownerName}</h3>
            </div>
            <div>
              {factor && factor.factorDate ? (
                <ShowDate timestamp={factor.factorDate} />
              ) : (
                <span></span>
              )}
            </div>
            <div>{tmpStatus}</div>
          </Grid>
          <Divider />
          <Grid item className="products-section" xs={12}>
            <FactorProductsTable shouldLink={true} products={factor.products} />
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
            <Link to={`/editFactor/${factor.customeId}`}>
              <Button
                className="newFactorAddProductInputButton"
                variant="outlined"
                color="primary"
              >
                ویرایش <EditIcon />
              </Button>
            </Link>
            <Link
              to={`/printFactors/${factor.factorDate - 1}/${
                factor.factorDate + 1
              }`}
            >
              <Button
                className="newFactorAddProductInputButton"
                variant="outlined"
                color="primary"
              >
                گزارش
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
