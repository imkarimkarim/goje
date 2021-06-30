import React, { useState, useEffect } from "react";
const { ipcRenderer } = require("electron");
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Notif from '../../Components/Notif.jsx';
import Nav from '../../Components/Nav.jsx';
import Input from '../../Components/Input.jsx';
import Grid from '@material-ui/core/Grid';

export default function Customer() {
  const [formData, setFormData] = useState('');
  const [submit, setSubmit] = useState(false);
  const [createStatus, setCreateStatus]  = useState(null);
  const [notif, setNotif] = useState(null);

  const setName = (e) => {
    setFormData(e.target.value);
  };

  const handleSubmit = () => {
    setSubmit(true);
    addNewCustomer(formData);
  };

  const addNewCustomer = (customer) => {
    ipcRenderer.send("addNewCustomer", customer);
  }

  useEffect(() => {
      ipcRenderer.on("addNewCustomer", (event, createStatus) => {
        setSubmit(false);
        setCreateStatus(createStatus);
        if(createStatus !== null){
          if(createStatus === true){
            setNotif(null);
            setNotif('success');
            setFormData('');
          }
          if(createStatus === false){
            setNotif(null);
            setNotif('error');
          }
        }
      });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("addNewCustomer");
    };
  });

  let notifJsx;
  if(notif === 'success') notifJsx = <Notif type="success" message="حساب جدید با موفقیت ایجاد شد" />;
  if(notif === 'error') notifJsx = <Notif type="error" message="خطا در ایجاد حساب(شاید حسابی با همین نام موجود باشد)" />


  return (
    <div className="NewCustomer-form">
      {
        (notifJsx) ? (
          notifJsx
        ) : ('')
      }
      <Nav/>
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h3>مشتری جدید</h3>
          </Grid>
          <Grid item xs={12}>
            <Input label="نام مشتری*" fun={setName} value={formData}/>
          </Grid>
          <br />
          <Grid item xs={12}>
            <Button disabled={submit || formData.length === 0} onClick={handleSubmit} variant="outlined" color="primary">
              ثبت مشتری
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
