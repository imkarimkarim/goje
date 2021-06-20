import React, { useState, useEffect } from "react";
const { ipcRenderer } = require("electron");
import TextField from "@material-ui/core/TextField";
import "./CustomerInput.css";
import CustomePicker from './CustomePicker.jsx';

const CustomerInput = React.memo(({ owner, ownerName, onPick, label }) => {
  const [allCustomers, setAllCustomers] = useState();
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);

  const getAllCustomers = () => {
    ipcRenderer.send("getAllCustomers");
  };

  const handleFocus = (e) => {
    getAllCustomers();
    setShowCustomerPicker(true);
  };

  useEffect(() => {
    ipcRenderer.on("getAllCustomers", (event, dbCustomers) => {
      setAllCustomers(dbCustomers);
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("getAllCustomers");
    };
  });

  return (
    <span className="customeInputAndPicker">
      {showCustomerPicker && allCustomers ? (
        <CustomePicker
          customers={allCustomers}
          onPick={onPick}
          setShowCustomerPicker={setShowCustomerPicker}
        />
      ) : (
        ""
      )}
      <TextField
        id="outlined-basic"
        size="small"
        variant="outlined"
        value={ownerName && ownerName}
        label={label}
        onFocus={handleFocus}
      />
    </span>
  );
})

export default CustomerInput;
