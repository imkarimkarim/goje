import React, { useState, useEffect, useContext, useReducer } from "react";
const { ipcRenderer } = require("electron");
import Button from "@material-ui/core/Button";
import DoneIcon from "@material-ui/icons/Done";
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
      setCreateStatus(createStatus.status);
      if (createStatus.status !== null) {
        if (createStatus.status === true) {
          formDispatch({
            type: "setForm",
            payload: schema,
          });
          pushNotif("success", createStatus.message);
        }
        if (createStatus.status === false) {
          pushNotif("error", createStatus.message);
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
              ثبت مشتری <DoneIcon />
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
