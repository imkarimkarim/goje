import React, { useState, useEffect } from "react";
import DoneIcon from "@material-ui/icons/Done";
const { ipcRenderer } = require("electron");
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Input from "../Input.jsx";
import ExpenseInput from "../ExpenseInput.jsx";
import "./ProductInput.css";
import ProductPicker from "./ProductPicker.jsx";

// TODO: also up/down with arrow keys

const ProductInputEditor = React.memo(({ formDispatch, label, state }) => {
  const [productState, setProductState] = useState("");
  const [allproducts, setAllproducts] = useState();
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [amount, setAmount] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (state) {
      setProductState({ name: state.name, id: state.id });
      setAmount(state.amount);
      setWeight(state.weight);
      setPrice(state.price);
    }
  }, [state]);

  const editProductOfFactor = () => {
    formDispatch({
      type: "editProduct",
      payload0: state.index,
      payload1: productState.id,
      payload5: productState.name,
      payload2: amount,
      payload3: weight,
      payload4: price,
    });
    setProductState("");
    setAmount("");
    setWeight("");
    setPrice("");
  };

  const getUnFinishedProducts = () => {
    ipcRenderer.send("getUnFinishedProducts");
  };

  const handleFocus = (e) => {
    getUnFinishedProducts();
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

  return productState !== "" ? (
    <div className="productInputEditor-wrapper">
      <span className="hint">ویرایش ردیف {state.index + 1}</span>
      <div className="productInputEditor">
        {showProductPicker && allproducts ? (
          <ProductPicker
            products={allproducts}
            setProductState={setProductState}
            productState={productState}
            setShowProductPicker={setShowProductPicker}
          />
        ) : (
          <div></div>
        )}
        <TextField
          size="small"
          variant="outlined"
          value={productState.name}
          label={label}
          onFocus={handleFocus}
        />
        <Input
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
          onClick={editProductOfFactor}
          variant="outlined"
          color="primary"
        >
          <DoneIcon />
        </Button>
      </div>
    </div>
  ) : (
    <div></div>
  );
});

export default ProductInputEditor;
