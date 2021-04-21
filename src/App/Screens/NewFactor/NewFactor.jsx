import React, { useState, useReducer, useEffect } from "react";
const { ipcRenderer } = require("electron");
import { DatePicker } from "jalali-react-datepicker";
import JDate from "jalali-date";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import Notif from "../../Components/Notif.jsx";
import Nav from "../../Components/Nav.jsx";
import Input from "../../Components/Input.jsx";
import CustomerInput from "../../Components/Customer/CustomerInput.jsx";
import ExpenseInput from "../../Components/ExpenseInput.jsx";
import ProductsTable from "../../Components/Product/ProductsTable.jsx";
import Expense from "../../Components/Expense.jsx";
import Conclusion from "../../Components/Conclusion.jsx";
import ProductInput from "../../Components/Product/ProductInput.jsx";
import Pays from "../../Components/Pays.jsx";
import "./NewFactor.css";

const newFactorSchema = {
  docType: "factor",
  owner: "",
  ownerName: "",
  isPayed: 0,
  factorDate: Date.now(),
  changeDate: Date.now(),
  products: [],
  pays: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "reset": {
      let NEWnewFactorSchema = newFactorSchema;
      NEWnewFactorSchema.factorDate = Date.now();
      NEWnewFactorSchema.changeDate = Date.now();
      return NEWnewFactorSchema;
    }
    case "setOwner":
      return { ...state, owner: action.payload1, ownerName: action.payload2 };
    case "setIsPayed":
      return { ...state, isPayed: action.payload };
    case "setFactorDate":
      return { ...state, factorDate: action.payload };
    case "setChangeDate":
      return { ...state, changeDate: action.payload };
    case "addProduct":
      return {
        ...state,
        products: [
          ...state.products,
          {
            productId: action.payload1,
            productName: action.payload5,
            amount: action.payload2,
            weight: action.payload3,
            price: action.payload4,
          },
        ],
      };
    case "removeProduct":
      state.products.splice(action.payload, 1);
      return {
        ...state,
        products: state.products,
      };
    case 'addPay':
    return {
      ...state,
      pays: [
        ...state.pays,
        {
          date: action.payload1,
          amount: action.payload2
        },
      ],
    };
    case "removePay":
      state.pays.splice(action.payload, 1);
      return {
        ...state,
        pays: state.pays,
      };
    default:
      return state;
  }
}

export default function NewFactor() {
  const [formData, formDispatch] = useReducer(reducer, newFactorSchema);
  const [submit, setSubmit] = useState(false);
  const [createStatus, setCreateStatus] = useState(null);
  const [notif, setNotif] = useState(null);

  const handleSubmit = () => {
    setSubmit(true);
    newFactor(formData);
  };

  const newFactor = (factor) => {
    ipcRenderer.send("newFactor", factor);
  };

  useEffect(() => {
    ipcRenderer.on("newFactor", (event, createStatus) => {
      setSubmit(false);
      setCreateStatus(createStatus);
      if (createStatus !== null) {
        if (createStatus === true) {
          formDispatch({ type: "reset" });
          setNotif(null);
          setNotif("success");
        }
        if (createStatus === false) {
          setNotif(null);
          setNotif("error");
        }
      }
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("newFactor");
    };
  });

  let notifJsx;
  if (notif === "success")
    notifJsx = <Notif type="success" message="فاکتور با موفقیت ثبت شد" />;
  if (notif === "error")
    notifJsx = <Notif type="error" message="خطا در ثبت کردن فاکتور" />;

  return (
    <div>
      {notifJsx ? notifJsx : ""}
      <Nav title="/فاکتور جدید" />
      <form className="NewFactor-form">
        <Grid container spacing={3}>
          <Grid className="header" item xs={12}>
            <CustomerInput
              label="صاحب فاکتور*"
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
                style={{ color: 'blue' }}
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
                style={{ color: 'red' }}
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
            <ProductInput formDispatch={formDispatch} label="شرح*" />
          </Grid>
          <Divider />
          {formData && formData.isPayed === false ? (
            <Grid item className="addpay-section" xs={12}>
              <Pays formDispatch={formDispatch} pays={formData.pays} onSubmit={(pay) => {
                  formDispatch({type: 'addPay', payload1: pay.date, payload2: pay.amount})
                }}/>
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
