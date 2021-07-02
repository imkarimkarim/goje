import React, { useState, useEffect, useRef, useReducer } from "react";
const { ipcRenderer } = require("electron");
import { DatePicker } from "jalali-react-datepicker";
import JDate from "jalali-date";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Notif from "../../Components/Notif.jsx";
import Nav from "../../Components/Nav.jsx";
import Input from "../../Components/Input.jsx";
import ExpenseInput from "../../Components/ExpenseInput.jsx";
import "./IncludeProduct.css";
import reducer from '../../Reducers/IncludeProductReducer.jsx';

const newProduct = {
  productName: "",
  owner: "",
  basculeWeight: "",
  amount: "",
  arrivalDate: Date.now(),
  commission: "",
  unload: "",
  portage: "",
  cash: "",
  plaque: "",
  ps: "",
};

export default function IncludeProduct() {
  // const [formData, setFormData] = useState(newProduct);
  const [formData, formDispatch] = useReducer(reducer, newProduct);

  const [submit, setSubmit] = useState(false);
  const [createStatus, setCreateStatus] = useState(null);
  const [notif, setNotif] = useState(null);

  // const setproductName = (e) => {
  //   setFormData({ ...formData, productName: e.target.value });
  // };
  // const setowner = (e) => {
  //   setFormData({ ...formData, owner: e.target.value });
  // };
  // const setbasculeWeight = (e) => {
  //   setFormData({ ...formData, basculeWeight: e.target.value });
  // };
  // const setamount = (e) => {
  //   setFormData({ ...formData, amount: e.target.value });
  // };
  // const setarrivalDate = (value) => {
  //   setFormData({ ...formData, arrivalDate:  });
  // };
  // const setcommission = (e) => {
  //   setFormData({ ...formData, commission: e.target.value });
  // };
  // const setunload = (e) => {
  //   setFormData({ ...formData, unload: e.target.value });
  // };
  // const setportage = (e) => {
  //   setFormData({ ...formData, portage: e.target.value });
  // };
  // const setcash = (e) => {
  //   setFormData({ ...formData, cash: e.target.value });
  // };
  // const setPlaque = (e) => {
  //   setFormData({ ...formData, plaque: e.target.value });
  // };
  // const setPs = (e) => {
  //   setFormData({ ...formData, ps: e.target.value });
  // };

  const handleSubmit = () => {
    setSubmit(true);
    includeProduct(formData);
  };

  const includeProduct = (product) => {
    ipcRenderer.send("includeProduct", product);
  };

  useEffect(() => {
    ipcRenderer.on("includeProduct", (event, createStatus) => {
      setSubmit(false);
      setCreateStatus(createStatus);
      if (createStatus !== null) {
        if (createStatus === true) {
          let newNewProduct = newProduct;
          newNewProduct.arrivalDate = Date.now();
          formDispatch({type:"setForm", payload: newNewProduct});
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
      ipcRenderer.removeAllListeners("includeProduct");
    };
  });

  let notifJsx;
  if (notif === "success")
    notifJsx = <Notif type="success" message="بار با موفقیت وارد شد" />;
  if (notif === "error")
    notifJsx = <Notif type="error" message="خطا در وارد کردن بار" />;

  return (
    <div>
      {notifJsx ? notifJsx : ""}
      <Nav/>
      <form className="IncludeProduct-form goje-container">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Input label="شرح بار*" fun={(e) => {formDispatch({type:"setproductName", payload: e.target.value})}} value={formData.productName} />
            <Input label="نام صاحب بار*" fun={(e) => {formDispatch({type:"setowner", payload: e.target.value})}} value={formData.owner} />
            <Input label="پلاک ماشین" fun={(e) => {formDispatch({type:"setPlaque", payload: e.target.value})}} value={formData.plaque} />
            <div className="arrivalDate">
              <span>تاریخ ورود:</span>
              <DatePicker
                timePicker={false}
                value={formData.arrivalDate}
                onClickSubmitButton={({ value }) => {
                  formDispatch({type: 'setarrivalDate', payload: value._d.getTime()});
                }}
              />
            </div>
            <Input
              label="باسکول(kg)*"
              fun={(e) => {formDispatch({type:"setbasculeWeight", payload: e.target.value})}}
              value={formData.basculeWeight}
            />
            <Input label="تعداد*" fun={(e) => {formDispatch({type:"setamount", payload: e.target.value})}} value={formData.amount} />
            <Input
              label="کارمزد(٪)*"
              fun={(e) => {formDispatch({type:"setcommission", payload: e.target.value})}}
              value={formData.commission}
            />
            <ExpenseInput
              label="تخلیه*"
              fun={(e) => {formDispatch({type:"setunload", payload: e.target.value})}}
              value={formData.unload}
            />
            <ExpenseInput
              label="کرایه*"
              fun={(e) => {formDispatch({type:"setportage", payload: e.target.value})}}
              value={formData.portage}
            />
            <ExpenseInput label="دستی*" fun={(e) => {formDispatch({type:"setcash", payload: e.target.value})}} value={formData.cash} />
          </Grid>
          <br />

          <Grid item xs={12}>
            <TextareaAutosize onChange={(e) => {formDispatch({type:"setPs", payload: e.target.value})}} value={formData.ps} rowsMin={3} placeholder="پی نوشت" />
            <br />
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
