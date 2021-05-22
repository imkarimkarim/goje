import React, { useState, useReducer, useEffect, useRef } from "react";
const { ipcRenderer } = require("electron");
import { useParams } from "react-router-dom";
import { DatePicker } from "jalali-react-datepicker";
import JDate from "jalali-date";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import Notif from "../Notif.jsx";
import Nav from "../Nav.jsx";
import Input from "../Input.jsx";
import CustomerInput from "../Customer/CustomerInput.jsx";
import ExpenseInput from "../ExpenseInput.jsx";
import ProductsTable from "../Product/ProductsTable.jsx";
import Conclusion from "../../Components/Conclusion.jsx";
import Expense from "../Expense.jsx";
import ProductInput from "../Product/ProductInput.jsx";
import Pays from "../Pays.jsx";
import "./EditFactor.css";
import ShowDate from '../ShowDate.jsx';

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
  id: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "setForm":
      return action.payload;
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
    case "addPay":
      return {
        ...state,
        pays: [
          ...state.pays,
          {
            date: action.payload1,
            amount: action.payload2,
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

export default function EditFactor() {
  const [formData, formDispatch] = useReducer(reducer, factorSchema);
  const [submit, setSubmit] = useState(false);
  const [editStatue, setEditStatue] = useState(null);
  const [notif, setNotif] = useState(null);
  const init = useRef(true);
  let { id } = useParams();

  const handleSubmit = () => {
    setSubmit(true);
    editFactor(formData);
  };

  const editFactor = (factor) => {
    ipcRenderer.send("editFactor", factor);
  };

  const sendOneFactor = (id) => {
    ipcRenderer.send("send-oneFactor", id);
  };

  useEffect(() => {
    if (init.current) {
      sendOneFactor(id);
      init.current = false;
    }

    ipcRenderer.on("send-oneFactor", (event, oneFactor) => {
      formDispatch({ type: "setForm", payload: oneFactor });
    });

    ipcRenderer.on("editFactor", (event, editStatue) => {
      setSubmit(false);
      setEditStatue(editStatue);
      if (editStatue !== null) {
        if (editStatue === true) {
          setNotif(null);
          setNotif("success");
        }
        if (editStatue === false) {
          setNotif(null);
          setNotif("error");
        }
      }
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("editFactor");
    };
  });

  let notifJsx;
  if (notif === "success")
    notifJsx = <Notif type="success" message="ویرایش با موفقیت انجام شد" />;
  if (notif === "error")
    notifJsx = <Notif type="error" message="حطا در ویرایش" />;

  return (
    <div>
      {notifJsx ? notifJsx : ""}
      <Nav title={"/ویرایش فاکتور/" + id} />
      <form className="EditFactor-form">
        <Grid container spacing={3}>
          <Grid className="header" item xs={12}>
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
                style={{ color: 'red' }}
                checked={formData.isPayed === false}
                onChange={() => {
                  formDispatch({ type: "setIsPayed", payload: false });
                }}
                value={false}
              />
            </div>
            <div>
              وصولی
              <Radio
                style={{ color: 'green' }}
                color="primary"
                checked={formData.isPayed === 'receipt'}
                onChange={() => {
                  formDispatch({ type: "setIsPayed", payload: 'receipt' });
                }}
                value={'receipt'}
              />
            </div>
            <div className="factorDate">
              {formData && formData.factorDate > 0 ? (
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
              ) : (
                <span></span>
              )}
              <div className="hint">آخرین تغییر در {formData && formData.changeDate ? <ShowDate timestamp={formData.changeDate} /> : <span></span>}</div>
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
          {formData && formData.pays && formData.isPayed !== true ? (
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
              ثبت ویرایش
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
