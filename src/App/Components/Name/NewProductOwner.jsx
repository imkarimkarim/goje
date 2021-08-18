import React, { useState, useEffect, useContext, useReducer } from "react";
const { ipcRenderer } = require("electron");
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DoneIcon from "@material-ui/icons/Done";
import Nav from "../../Components/Nav.jsx";
import Input from "../../Components/Input.jsx";
import Grid from "@material-ui/core/Grid";
import reducer from "../../Reducers/NewProductOwnerReducer.jsx";
import { NotifContext } from "../../Contexts/NotifContext.jsx";
import { generateInputByUserProductOwnerSchema } from "../../../schemas.js";

const schema = generateInputByUserProductOwnerSchema();

export default function NewProductOwner() {
  const [formData, formDispatch] = useReducer(reducer, schema);
  const [submit, setSubmit] = useState(false);
  const [createStatus, setCreateStatus] = useState(null);
  const { pushNotif } = useContext(NotifContext);

  const handleSubmit = () => {
    setSubmit(true);
    addNewProductOwner(formData);
  };

  const addNewProductOwner = (productOwner) => {
    ipcRenderer.send("addNewProductOwner", productOwner);
  };

  useEffect(() => {
    ipcRenderer.on("addNewProductOwner", (event, createStatus) => {
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
      ipcRenderer.removeAllListeners("addNewProductOwner");
    };
  });

  return (
    <div className="newProductOwner-form">
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h3>صاحب بار جدید</h3>
          </Grid>
          <Grid item xs={12}>
            <Input
              label="نام صاحب بار*"
              fun={(e) => {
                formDispatch({
                  type: "setName",
                  payload: e.target.value,
                });
              }}
              value={formData.name}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              label="اطلاعات واریز"
              fun={(e) => {
                formDispatch({
                  type: "setPaysNumber",
                  payload: e.target.value,
                });
              }}
              value={formData.payNumber}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              label="کارمزد پیشفرض"
              fun={(e) => {
                formDispatch({
                  type: "setDefaultCommission",
                  payload: e.target.value,
                });
              }}
              value={formData.defaultCommission}
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
              ثبت صاحب بار <DoneIcon />
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
