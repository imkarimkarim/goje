import React, { useState, useEffect, useRef, useReducer } from "react";
const { ipcRenderer } = require("electron");
import { useParams } from "react-router-dom";
import { DatePicker } from "jalali-react-datepicker";
import JDate from "jalali-date";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Notif from "../../Components/Notif.jsx";
import Nav from "../../Components/Nav.jsx";
import Input from "../../Components/Input.jsx";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import ExpenseInput from "../../Components/ExpenseInput.jsx";
import "./EditProduct.css";
import reducer from '../../Reducers/EditProductReducer.jsx';

// TODO: add backend for edit product

const productSchema = {
  docType: "product",
  customeId: null,
  productName: "",
  owner: "",
  basculeWeight: 0,
  amount: 0,
  arrivalDate: 0,
  finishDate: false,
  isProductFinish: false,
  commission: 0,
  unload: 0,
  portage: 0,
  cash: 0,
  plaque: "",
  ps: "",
};

export default function EditProduct() {
  // const [formData, setFormData] = useState(productSchema);
  const [formData, formDispatch] = useReducer(reducer, productSchema);
  const [submit, setSubmit] = useState(false);
  const [editStatue, setEditStatue] = useState(null);
  const [notif, setNotif] = useState(null);
  const init = useRef(true);
  let { id } = useParams();

  const handleSubmit = () => {
    setSubmit(true);
    editProduct(formData);
  };

  const editProduct = (product) => {
    ipcRenderer.send("editProduct", product);
  };

  const getOneProduct = (id) => {
    ipcRenderer.send("getOneProduct", id);
  };
  
  useEffect(() => {
    if (init.current) {
      getOneProduct(id);
      init.current = false;
    }

    ipcRenderer.on("getOneProduct", (event, product) => {
      formDispatch({type: "setForm", payload: product});
    });

    ipcRenderer.on("editProduct", (event, editStatue) => {
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
      ipcRenderer.removeAllListeners("editProduct");
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
      <Nav title={"/ویرایش بار/" + id} />
      <form className="EditProduct-form">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isProductFinish}
                  onChange={() => {
                    formDispatch({
                      type: "toggleIsProductFinish",
                      payload: "",
                    });
                  }}
                />
              }
              label="اتمام بار:"
              labelPlacement="start"
            />
            <Grid item xs={12}>
              <Input
                label="شرح بار*"
                fun={(e) => {
                  formDispatch({
                    type: "setproductName",
                    payload: e.target.value,
                  });
                }}
                value={formData.productName}
              />
              <Input
                label="نام صاحب بار*"
                fun={(e) => {
                  formDispatch({ type: "setowner", payload: e.target.value });
                }}
                value={formData.owner}
              />
              <Input
                label="پلاک ماشین"
                fun={(e) => {
                  formDispatch({ type: "setPlaque", payload: e.target.value });
                }}
                value={formData.plaque}
              />
              <div className="arrivalDate">
                <span>تاریخ ورود:</span>
                {formData && formData.arrivalDate > 0 ? (
                  <DatePicker
                    timePicker={false}
                    value={formData.arrivalDate}
                    onClickSubmitButton={({ value }) => {
                      formDispatch({
                        type: "setarrivalDate",
                        payload: value._d.getTime(),
                      });
                    }}
                  />
                ) : (
                  <span></span>
                )}
              </div>
              <Input
                label="باسکول(kg)*"
                fun={(e) => {
                  formDispatch({
                    type: "setbasculeWeight",
                    payload: e.target.value,
                  });
                }}
                value={formData.basculeWeight}
              />
              <Input
                label="تعداد"
                fun={(e) => {
                  formDispatch({ type: "setamount", payload: e.target.value });
                }}
                value={formData.amount}
              />
              <Input
                label="کارمزد(٪)*"
                fun={(e) => {
                  formDispatch({
                    type: "setcommission",
                    payload: e.target.value,
                  });
                }}
                value={formData.commission}
              />
              <ExpenseInput
                label="تخلیه*"
                fun={(e) => {
                  formDispatch({ type: "setunload", payload: e.target.value });
                }}
                value={formData.unload}
              />
              <ExpenseInput
                label="کرایه*"
                fun={(e) => {
                  formDispatch({ type: "setportage", payload: e.target.value });
                }}
                value={formData.portage}
              />
              <ExpenseInput
                label="دستی"
                fun={(e) => {
                  formDispatch({ type: "setcash", payload: e.target.value });
                }}
                value={formData.cash}
              />
            </Grid>
            <br />
            <Grid item xs={12}>
              <TextareaAutosize
                onChange={(e) => {
                  formDispatch({ type: "setPs", payload: e.target.value });
                }}
                value={formData.ps}
                rowsMin={3}
                placeholder="پی نوشت"
              />
              <br />
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
        </Grid>
      </form>
    </div>
  );
}
