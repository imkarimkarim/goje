import React, { useState, useEffect } from "react";
const { ipcRenderer } = require("electron");
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Input from "../Input.jsx";
import ExpenseInput from "../ExpenseInput.jsx";
import "./ProductInput.css";
import ProductPicker from "./ProductPicker.jsx";

// TODO: also up/down with arrow keys

const defaultState = { name: "", id: "" };

const ProductInput = React.memo(({ formDispatch, label }) => {
  const [productState, setProductState] = useState(defaultState);
  const [allproducts, setAllproducts] = useState();
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [amount, setAmount] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");

  const addProductToFactor = () => {
    formDispatch({
      type: "addProduct",
      payload1: productState.id,
      payload5: productState.name,
      payload2: amount,
      payload3: weight,
      payload4: price,
    });
    setProductState(defaultState);
    setAmount("");
    setWeight("");
    setPrice("");
    document.getElementById("focusOnMe1").focus();
  };

  const getUnFinishedProducts = () => {
    ipcRenderer.send("getUnFinishedProducts");
  };

  const handleFocus = (e) => {
    getUnFinishedProducts();
    setProductState({ name: "", id: "" });
    setShowProductPicker(true);
  };

  useEffect(() => {
    ipcRenderer.on("getUnFinishedProducts", (event, dbproducts) => {
      setAllproducts(dbproducts);
    });
    // clean up
    return () => {
      ipcRenderer.removeAllListeners("getUnFinishedProducts");
    };
  });

  return (
    <div className="productInput-wrapper">
      {showProductPicker && allproducts ? (
        <ProductPicker
          products={allproducts}
          setProductState={setProductState}
          productState={productState}
          setShowProductPicker={setShowProductPicker}
        />
      ) : (
        ""
      )}
      <TextField
        id="focusOnMe1"
        size="small"
        variant="outlined"
        value={productState.name}
        label={label}
        onFocus={handleFocus}
      />
      <Input
        id="focusOnMe2"
        value={amount}
        label="تعداد*"
        fun={(e) => {
          setAmount(e.target.value);
        }}
      />
      <Input
        value={weight}
        label="وزن*"
        fun={(e) => {
          setWeight(e.target.value);
        }}
      />
      <ExpenseInput
        value={price}
        label="فی*"
        fun={(e) => {
          setPrice(e.target.value);
        }}
      />
      <Button
        className="newFactorAddProductInputButton"
        disabled={
          !(productState.id && productState.name && amount && weight && price)
        }
        onClick={addProductToFactor}
        variant="outlined"
        color="primary"
      >
        +
      </Button>
    </div>
  );
});

export default ProductInput;
