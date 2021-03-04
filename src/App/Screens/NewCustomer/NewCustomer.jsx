import React, { useState, useEffect } from "react";
import ScreenTitle from "../../Components/ScreenTitle.jsx";
import TextField from "@material-ui/core/TextField";
import "./NewCustomer.css";
import Button from "@material-ui/core/Button";
const { ipcRenderer } = require("electron");

export default function NewCustomer() {
  const [formData, setFormData] = useState({ name: "", address: "" });
  const [submit, setSubmit] = useState(false);
  
  const setName = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const setAddress = (e) => {
    setFormData({ ...formData, address: e.target.value });
  };

  const handleSubmit = () => {
    setSubmit(true);
    isCustomerExists(formData);
  };
  
  const isCustomerExists = (customer) => {
    ipcRenderer.send("isCustomerExists", customer);
  }
  
  useEffect(() => {
      ipcRenderer.on("customerExists", (event, oneProduct) => {
      });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("customerExists");
    };
  });

  return (
    <div>
      <ScreenTitle title="مشتری جدید" />
      <form className="NewCustomer-form">
        <TextField
          id="outlined-basic"
          size="small"
          variant="outlined"
          value={formData.name}
          onChange={setName}
          label="نام"
        />
        <br />
        <br />
        <TextField
          id="outlined-basic"
          size="small"
          variant="outlined"
          value={formData.address}
          onChange={setAddress}
          label="آدرس"
        />
        <br />
        <br />
          <Button disabled={submit} onClick={handleSubmit} variant="outlined" color="primary">
            ثبت
          </Button>
      </form>
    </div>
  );
}
