import React, { useState, useEffect, useContext, useReducer } from "react";
const { ipcRenderer } = require("electron");
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Nav from "../../Components/Nav.jsx";
import Input from "../../Components/Input.jsx";
import Grid from "@material-ui/core/Grid";
import reducer from "../../Reducers/NewCustomerReducer.jsx";
import { NotifContext } from "../../Contexts/NotifContext.jsx";
import { generateInputByUserCustomerSchema } from "../../../schemas.js";

const schema = generateInputByUserCustomerSchema();

export default function NewCustomer() {
  const [formData, formDispatch] = useReducer(reducer, schema);
  const [submit, setSubmit] = useState(false);
  const [createStatus, setCreateStatus] = useState(null);
  const { pushNotif } = useContext(NotifContext);

  const handleSubmit = () => {
    setSubmit(true);
    addNewCustomer(formData);
  };

  const addNewCustomer = (customer) => {
    ipcRenderer.send("addNewCustomer", customer);
  };

  useEffect(() => {
    ipcRenderer.on("addNewCustomer", (event, createStatus) => {
      setSubmit(false);
      setCreateStatus(createStatus);
      if (createStatus !== null) {
        if (createStatus === true) {
          formDispatch({
            type: "setForm",
            payload: schema,
          });
          pushNotif("success", "حساب جدید با موفقیت ایجاد شد");
        }
        if (createStatus === false) {
          pushNotif(
            "error",
            "خطا در ایجاد حساب(شاید حسابی با همین نام موجود باشد)"
          );
        }
      }
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("addNewCustomer");
    };
  });

  return (
    <div className="NewCustomer-form">
      <Nav />
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h3>مشتری جدید</h3>
          </Grid>
          <Grid item xs={12}>
            <Input
              label="نام مشتری*"
              fun={(e) => {
                formDispatch({
                  type: "setName",
                  payload: e.target.value,
                });
              }}
              value={formData.name}
            />
          </Grid>
          <br />
          <Grid item xs={12}>
            <Button
              disabled={
                submit || formData.name === null || formData.name.length === 0
              }
              onClick={handleSubmit}
              variant="outlined"
              color="primary"
            >
              ثبت مشتری
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
