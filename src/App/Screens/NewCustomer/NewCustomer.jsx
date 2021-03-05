import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import "./NewCustomer.css";
import Button from "@material-ui/core/Button";
const { ipcRenderer } = require("electron");
import Notif from '../../Components/Notif.jsx';
import Nav from '../../Components/Nav.jsx';
import Input from '../../Components/Input.jsx';
import Grid from '@material-ui/core/Grid';

export default function NewCustomer() {
  const [formData, setFormData] = useState({ name: "", address: "" });
  const [submit, setSubmit] = useState(false);
  const [createStatus, setCreateStatus]  = useState(null);
  const [notif, setNotif] = useState(null);
  
  const setName = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const setAddress = (e) => {
    setFormData({ ...formData, address: e.target.value });
  };

  const handleSubmit = () => {
    setSubmit(true);
    addCustomer(formData);
  };
  
  const addCustomer = (customer) => {
    ipcRenderer.send("addCustomer", customer);
  }
  
  useEffect(() => {
      ipcRenderer.on("addCustomer", (event, createStatus) => {
        setSubmit(false);
        setCreateStatus(createStatus);
        if(createStatus !== null){
          if(createStatus === true){
            setNotif(null);
            setNotif('success');
            setFormData({ name: "", address: "" });
          }
          if(createStatus === false){
            setNotif(null);
            setNotif('error');
          }
        }
      });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("addCustomer");
    };
  });
  
  let notifJsx;
  if(notif === 'success') notifJsx = <Notif type="success" message="مشتری با موفقیت ثبت شد" />;
  if(notif === 'error') notifJsx = <Notif type="error" message="مشتری با همین نام قبلا ثبت شده است" />


  return (
    <div>
      {
        (notifJsx) ? (
          notifJsx
        ) : ('')
      }
      <Nav title="/مشتری جدید" />
      <form className="NewCustomer-form">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Input label="نام" fun={setName} value={formData.name}/>
            <Input label="آدرس" fun={setAddress} value={formData.address}/>
          </Grid>
          <br />
          <Grid item xs={12}>
            <Button disabled={submit} onClick={handleSubmit} variant="outlined" color="primary">
              ثبت
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
