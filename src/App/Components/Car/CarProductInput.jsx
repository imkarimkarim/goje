import React, { useState, useEffect } from "react";
const { ipcRenderer } = require("electron");
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Input from "../Input.jsx";
import ExpenseInput from "../ExpenseInput.jsx";
import "./CarProductInput.css";
import { convertToIntIfIsNumber } from "../../utils";

// TODO: also up/down with arrow keys

const defaultState = {
  productName: "",
  signHint: "",
  amount: "",
  weight: "",
  price: "",
};

const CarProductInput = React.memo(({ formDispatch }) => {
  const [state, setState] = useState(defaultState);

  const addProductToCar = () => {
    formDispatch({
      type: "addProduct",
      payload: state,
    });
    setState(defaultState);
    document.getElementById("productName").focus();
  };

  return (
    <div className="includeProductInput-wrapper">
      <span>اضافه کردن بار:</span>
      <hr />
      <Input
        id="productName"
        value={state.productName}
        label="شرح*"
        fun={(e) => {
          setState({ ...state, productName: e.target.value });
        }}
      />
      <Input
        id="signHint"
        value={state.signHint}
        label="علامت"
        fun={(e) => {
          setState({ ...state, signHint: e.target.value });
        }}
      />
      <Input
        value={state.amount}
        label="تعداد"
        fun={(e) => {
          setState({
            ...state,
            amount: convertToIntIfIsNumber(e.target.value),
          });
        }}
      />
      <Input
        value={state.weight}
        label="وزن"
        fun={(e) => {
          setState({
            ...state,
            weight: convertToIntIfIsNumber(e.target.value),
          });
        }}
      />
      <ExpenseInput
        value={state.price}
        label="فی حدودی"
        fun={(e) => {
          setState({ ...state, price: convertToIntIfIsNumber(e.target.value) });
        }}
      />
      <Button
        className="includeProductAddProductInputButton"
        disabled={!(state.productName && state.productName !== "")}
        onClick={addProductToCar}
        variant="outlined"
        color="primary"
      >
        <AddIcon />
      </Button>
      <hr />
    </div>
  );
});

export default CarProductInput;
