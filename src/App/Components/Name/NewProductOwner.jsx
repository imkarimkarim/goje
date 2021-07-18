import React, { useState, useEffect, useContext } from "react";
const { ipcRenderer } = require("electron");
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Nav from "../../Components/Nav.jsx";
import Input from "../../Components/Input.jsx";
import Grid from "@material-ui/core/Grid";
import { NotifContext } from "../../Contexts/NotifContext.jsx";

export default function NewProductOwner() {
  const [ownerName, setOwnerName] = useState("");
  const [ownerPaysInfo, setOwnerPaysInfo] = useState("");
  const [ownerDefaultCommission, setOwnerDefaultCommission] = useState("");
  const [submit, setSubmit] = useState(false);
  const [createStatus, setCreateStatus] = useState(null);
  const { pushNotif } = useContext(NotifContext);

  const setName = (e) => {
    setOwnerName(e.target.value);
  };

  const setPaysInfo = (e) => {
    setOwnerPaysInfo(e.target.value);
  };

  const setDefaultCommission = (e) => {
    setOwnerDefaultCommission(e.target.value);
  };

  const handleSubmit = () => {
    setSubmit(true);
    addNewProductOwner({
      name: ownerName,
      paysInfo: ownerPaysInfo,
      defaultCommission: ownerDefaultCommission,
    });
  };

  const addNewProductOwner = (owner) => {
    ipcRenderer.send("addNewProductOwner", owner);
  };

  useEffect(() => {
    ipcRenderer.on("addNewProductOwner", (event, createStatus) => {
      setSubmit(false);
      setCreateStatus(createStatus);
      if (createStatus !== null) {
        if (createStatus === true) {
          pushNotif("success", "حساب جدید با موفقیت ایجاد شد");
          setOwnerName("");
          setOwnerPaysInfo("");
          setOwnerDefaultCommission("");
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
      ipcRenderer.removeAllListeners("addNewProductOwner");
    };
  });

  return (
    <div className="newProductOwner-form">
      <Nav />
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h3>صاحب بار جدید</h3>
          </Grid>
          <Grid item xs={12}>
            <Input label="نام صاحب بار*" fun={setName} value={ownerName} />
          </Grid>
          <Grid item xs={12}>
            <Input
              label="اطلاعات واریز"
              fun={setPaysInfo}
              value={ownerPaysInfo}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              label="کارمزد پیشفرض"
              fun={setDefaultCommission}
              value={ownerDefaultCommission}
            />
          </Grid>
          <br />
          <Grid item xs={12}>
            <Button
              disabled={submit || ownerName.length === 0}
              onClick={handleSubmit}
              variant="outlined"
              color="primary"
            >
              ثبت صاحب بار
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
