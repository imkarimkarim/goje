import React, { useState, useEffect, useRef } from "react";
const { ipcRenderer } = require("electron");
import { useParams } from "react-router-dom";
import { DatePicker } from "jalali-react-datepicker";
import JDate from "jalali-date";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Notif from "../../Components/Notif.jsx";
import Nav from "../../Components/Nav.jsx";
import Input from "../../Components/Input.jsx";
import ExpenseInput from "../../Components/ExpenseInput.jsx";
import "./EditProduct.css";

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
  ps: '',
};

export default function IncludeProduct() {
  const [formData, setFormData] = useState(productSchema);
  const [submit, setSubmit] = useState(false);
  const [editStatue, setEditStatue] = useState(null);
  const [notif, setNotif] = useState(null);
  const init = useRef(true);
  let { id } = useParams();

  const setproductName = (e) => {
    setFormData({ ...formData, productName: e.target.value });
  };
  const setowner = (e) => {
    setFormData({ ...formData, owner: e.target.value });
  };
  const setbasculeWeight = (e) => {
    setFormData({ ...formData, basculeWeight: e.target.value });
  };
  const setamount = (e) => {
    setFormData({ ...formData, amount: e.target.value });
  };
  const setarrivalDate = (value) => {
    setFormData({ ...formData, arrivalDate: value._d.getTime() });
  };
  const setcommission = (e) => {
    setFormData({ ...formData, commission: e.target.value });
  };
  const setunload = (e) => {
    setFormData({ ...formData, unload: e.target.value });
  };
  const setportage = (e) => {
    setFormData({ ...formData, portage: e.target.value });
  };
  const setcash = (e) => {
    setFormData({ ...formData, cash: e.target.value });
  };
  const setPlaque = (e) => {
    setFormData({ ...formData, plaque: e.target.value });
  };
  const toggleIsProductFinish = () => {
    setFormData({
      ...formData,
      isProductFinish: !formData.isProductFinish,
      finishDate: Date.now(),
    });
  };
  const setPs = (e) => {
    setFormData({ ...formData, ps: e.target.value });
  };

  const handleSubmit = () => {
    setSubmit(true);
    editProduct(formData);
  };

  const editProduct = (product) => {
    ipcRenderer.send("editProduct", product);
  };

  const sendOneProduct = (id) => {
    ipcRenderer.send("send-oneProduct", id);
  };

  useEffect(() => {
    if (init.current) {
      sendOneProduct(id);
      init.current = false;
    }

    ipcRenderer.on("oneProduct", (event, oneProduct) => {
      setFormData(oneProduct);
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
            <Button
              onClick={toggleIsProductFinish}
              variant="outlined"
              color="primary"
            >
              {formData.isProductFinish ? 'بازکردن صافی' : 'بستن صافی'}
            </Button>
            <Grid item xs={12}>
              <Input
                label="شرح*"
                fun={setproductName}
                value={formData.productName}
              />
              <Input label="صاحب بار*" fun={setowner} value={formData.owner} />
              <Input
                label="پلاک ماشین"
                fun={setPlaque}
                value={formData.plaque}
              />
              <div className="arrivalDate">
                <span>تاریخ ورود:</span>
                {formData && formData.arrivalDate > 0 ? (
                  <DatePicker
                    timePicker={false}
                    value={formData.arrivalDate}
                    onClickSubmitButton={({ value }) => {
                      setarrivalDate(value);
                    }}
                  />
                ) : (
                  <span></span>
                )}
              </div>
              <Input
                label="باسکول(kg)*"
                fun={setbasculeWeight}
                value={formData.basculeWeight}
              />
              <Input label="تعداد" fun={setamount} value={formData.amount} />
              <Input
                label="کارمزد(٪)*"
                fun={setcommission}
                value={formData.commission}
              />
              <ExpenseInput
                label="تخلیه*"
                fun={setunload}
                value={formData.unload}
              />
              <ExpenseInput
                label="کرایه*"
                fun={setportage}
                value={formData.portage}
              />
              <ExpenseInput label="دستی" fun={setcash} value={formData.cash} />
            </Grid>
            <br />
            <Grid item xs={12}>
              <TextareaAutosize onChange={setPs} value={formData.ps} rowsMin={3} placeholder="پی نوشت" />
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
