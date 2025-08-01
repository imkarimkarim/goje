/* eslint-disable react/display-name */
import React, { useState, useEffect } from "react";
const { ipcRenderer } = require("electron");
import TextField from "@material-ui/core/TextField";
import "./ProductOwnerInput.css";
import ProductOwnerPicker from "./ProductOwnerPicker.jsx";

const ProductOwnerInput = React.memo(({ owner, onPick, label }) => {
  const [allProductOwners, setAllProductOwners] = useState();
  const [showProductOwnerPicker, setShowProductOwnerPicker] = useState(false);

  const getAllProductOwners = () => {
    ipcRenderer.send("getAllProductOwners");
  };

  const handleFocus = () => {
    getAllProductOwners();
    setShowProductOwnerPicker(true);
  };

  useEffect(() => {
    ipcRenderer.on("getAllProductOwners", (event, dbProductOwners) => {
      setAllProductOwners(dbProductOwners);
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("getAllProductOwners");
    };
  });

  return (
    <span className="customeInputAndPicker">
      {showProductOwnerPicker && allProductOwners ? (
        <ProductOwnerPicker
          productOwners={allProductOwners}
          onPick={onPick}
          setShowProductOwnerPicker={setShowProductOwnerPicker}
        />
      ) : (
        ""
      )}
      <TextField
        id="outlined-basic"
        size="small"
        variant="outlined"
        value={owner && owner}
        label={label}
        onFocus={handleFocus}
      />
    </span>
  );
});

export default ProductOwnerInput;
