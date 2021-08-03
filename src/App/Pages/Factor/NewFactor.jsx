import React, { useState, useReducer, useEffect, useContext } from "react";
const { ipcRenderer } = require("electron");
import { DatePicker } from "jalali-react-datepicker";
import JDate from "jalali-date";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import Nav from "../../Components/Nav.jsx";
import Input from "../../Components/Input.jsx";
import CustomerInput from "../../Components/Customer/CustomerInput.jsx";
import ExpenseInput from "../../Components/ExpenseInput.jsx";
import ProductsTable from "../../Components/Factor/ProductsTable.jsx";
import Expense from "../../Components/Expense.jsx";
import Conclusion from "../../Components/Factor/Conclusion.jsx";
import ProductInput from "../../Components/Product/ProductInput.jsx";
import Pays from "../../Components/Factor/Pays.jsx";
import "./NewFactor.css";
import { reducer, schema } from "../../Reducers/NewFactorReducer.jsx";
import { NotifContext } from "../../Contexts/NotifContext.jsx";

export default function NewFactor() {
  const [formData, formDispatch] = useReducer(reducer, schema);
  const [submit, setSubmit] = useState(false);
  const [createStatus, setCreateStatus] = useState(null);
  const { pushNotif } = useContext(NotifContext);

  const handleSubmit = () => {
    setSubmit(true);
    addNewFactor(formData);
  };

  const addNewFactor = (factor) => {
    ipcRenderer.send("addNewFactor", factor);
  };

  useEffect(() => {
    ipcRenderer.on("addNewFactor", (event, createStatus) => {
      setSubmit(false);
      setCreateStatus(createStatus.status);
      if (createStatus.status !== null) {
        if (createStatus.status === true) {
          formDispatch({ type: "reset" });
          pushNotif("success", createStatus.message);
        }
        if (createStatus.status === false) {
          pushNotif("error", createStatus.message);
        }
      }
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("addNewFactor");
    };
  });

  return (
    <div>
      <Nav />
      <form className="NewFactor-form goje-container">
        <Grid container spacing={3}>
          <Grid className="header" item xs={10}>
            <CustomerInput
              label="نام مشتری*"
              className="customeInputAndPicker"
              onPick={(id, name) => {
                formDispatch({
                  type: "setOwner",
                  payload1: id,
                  payload2: name,
                });
              }}
              owner={formData && formData.owner}
              ownerName={formData && formData.ownerName}
            />
            <div>
              نقدی
              <Radio
                checked={formData.isPayed === true}
                style={{ color: "blue" }}
                onChange={() => {
                  formDispatch({ type: "setIsPayed", payload: true });
                }}
                value={true}
              />
            </div>
            <div>
              نسیه
              <Radio
                checked={formData.isPayed === false}
                style={{ color: "red" }}
                onChange={() => {
                  formDispatch({ type: "setIsPayed", payload: false });
                }}
                value={false}
              />
            </div>
            <div className="factorDate">
              <DatePicker
                timePicker={false}
                value={formData.factorDate}
                onClickSubmitButton={({ value }) => {
                  formDispatch({
                    type: "setFactorDate",
                    payload: value._d.getTime(),
                  });
                  formDispatch({
                    type: "setChangeDate",
                    payload: Date.now(),
                  });
                }}
              />
            </div>
          </Grid>
          <Divider />
          <Grid item className="products-section" xs={12}>
            <ProductsTable
              products={formData.products}
              formDispatch={formDispatch}
            />
            <Conclusion products={formData.products} pays={formData.pays} />
          </Grid>
          <Grid item className="addproduct-section" xs={12}>
            <ProductInput formDispatch={formDispatch} label="شرح بار*" />
          </Grid>
          <Divider />
          {formData && formData.isPayed === false ? (
            <Grid item className="addpay-section" xs={12}>
              <Pays
                formDispatch={formDispatch}
                pays={formData.pays}
                onSubmit={(pay) => {
                  formDispatch({
                    type: "addPay",
                    payload1: pay.date,
                    payload2: pay.amount,
                  });
                }}
              />
            </Grid>
          ) : (
            <div></div>
          )}
          <Grid item xs={12}>
            <Button
              disabled={submit}
              onClick={handleSubmit}
              variant="outlined"
              color="primary"
            >
              ثبت
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
