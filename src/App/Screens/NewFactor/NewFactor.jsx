import React, { useState, useReducer, useEffect } from "react";
import Button from "@material-ui/core/Button";
const { ipcRenderer } = require("electron");
import Notif from "../../Components/Notif.jsx";
import Nav from "../../Components/Nav.jsx";
import Input from "../../Components/Input.jsx";
import CustomerInput from "../../Components/CustomerInput.jsx";
import ExpenseInput from "../../Components/ExpenseInput.jsx";
import ProductsTable from "../../Components/ProductsTable.jsx";
import JDate from "jalali-date";
import Expense from "../../Components/Expense.jsx";
import Grid from "@material-ui/core/Grid";
import { DatePicker } from "jalali-react-datepicker";
import "./NewFactor.css";
import Divider from "@material-ui/core/Divider";
import Radio from "@material-ui/core/Radio";
import ProductInput from "../../Components/ProductInput.jsx";

const newFactor = {
  docType: "factor",
  owner: "",
  by: "",
  isPayed: "",
  payedDate: "",
  factorDate: Date.now(),
  changeDate: Date.now(),
  payedRecords: [],
  products: [
    {
      productId: "121",
      amount: "22",
      weight: "200",
      price: "100000",
    },
  ],
};

function reducer(state, action) {
  switch (action.type) {
    case "setOwner":
      return { ...state, owner: action.payload };
    case "setBy":
      return { ...state, by: action.payload };
    case "setIsPayed":
      return { ...state, isPayed: action.payload };
    case "setPayedDate":
      return { ...state, payedDate: action.payload };
    case "setFactorDate":
      return { ...state, factorDate: action.payload };
    case "setChangeDate":
      return { ...state, changeDate: action.payload };
    case "setPayedRecords":
      return {
        ...state,
        payedRecords: [
          ...state.payedRecords,
          { payedDate: action.payload1, payedAmount: action.payload2 },
        ],
      };
    case "addProduct":
      return {
        ...state,
        products: [
          ...state.products,
          {
            productId: action.payload1,
            amount: action.payload2,
            weight: action.payload3,
            price: action.payload4,
          },
        ],
      };
      break;
    default:
  }
}

export default function NewFactor() {
  const [formData, formDispatch] = useReducer(reducer, newFactor);
  const [submit, setSubmit] = useState(false);
  const [createStatus, setCreateStatus] = useState(null);
  const [notif, setNotif] = useState(null);
  const [showFindCustomer, setShowFindCustomer] = useState(false);

  const handleSubmit = () => {
    setSubmit(true);
    console.log(formData);
    // includeProduct(formData);
  };

  // const includeProduct = (product) => {
  //   ipcRenderer.send("includeProduct", product);
  // }

  // useEffect(() => {
  //     ipcRenderer.on("includeProduct", (event, createStatus) => {
  //       setSubmit(false);
  //       setCreateStatus(createStatus);
  //       if(createStatus !== null){
  //         if(createStatus === true){
  //           setFormData(newProduct);
  //           setNotif(null);
  //           setNotif('success');
  //         }
  //         if(createStatus === false){
  //           setNotif(null);
  //           setNotif('error');
  //         }
  //       }
  //     });

  //   // clean up
  //   return () => {
  //     ipcRenderer.removeAllListeners("includeProduct");
  //   };
  // });

  let notifJsx;
  if (notif === "success")
    notifJsx = <Notif type="success" message="بار با موفقیت وارد شد" />;
  if (notif === "error")
    notifJsx = <Notif type="error" message="خطا در وارد کردن بار" />;

  return (
    <div>
      {notifJsx ? notifJsx : ""}
      <Nav title="/فاکتور جدید" />
      <form className="NewFactor-form">
        <Grid container spacing={3}>
          <Grid className="header" item xs={12}>
            <CustomerInput
              label="صاحب فاکتور*"
              className="customerInput"
              formDispatch={formDispatch}
              owner={formData.owner}
            />
            <div>
              نقدی
              <Radio
                checked={formData.isPayed === true}
                color="primary"
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
                  setarrivalDate(value);
                }}
              />
            </div>
          </Grid>
          <Divider />
          <Grid item className="products-section" xs={12}>
            <ProductsTable products={formData.products} />
          </Grid>
          <Grid item className="addproduct-section" xs={12}>
            <ProductInput formDispatch={formDispatch} label="شرح کالا" />
          </Grid>
          <Divider />
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
