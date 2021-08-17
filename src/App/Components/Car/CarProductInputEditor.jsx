import React, { useState, useEffect } from "react";
import DoneIcon from "@material-ui/icons/Done";
const { ipcRenderer } = require("electron");
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Input from "../Input.jsx";
import ExpenseInput from "../ExpenseInput.jsx";
import "./CarProductInput.css";

// TODO: also up/down with arrow keys

const CarProductInputEditor = React.memo(
  ({ formDispatch, label, state }) => {
    const [productState, setProductState] = useState("");
    const [signHint, setSignHint] = useState("");
    const [amount, setAmount] = useState("");
    const [weight, setWeight] = useState("");
    const [price, setPrice] = useState("");
    console.log(state);
    useEffect(() => {
      if (state) {
        if (state.id) {
          setProductState({ name: state.name, id: state.id });
          setAmount(state.amount);
          setWeight(state.weight);
          setPrice(state.price);
        } else {
          setProductState({ name: state.name });
          setAmount(state.amount);
          setWeight(state.weight);
          setPrice(state.price);
        }
      }
    }, [state]);

    const editProductOfCar = () => {
      if (state.id) {
        formDispatch({
          type: "editProduct",
          payload0: state.index,
          payload1: productState.id,
          payload5: productState.name,
          payload2: amount,
          payload3: weight,
          payload4: price,
          payload6: signHint,
        });
      } else {
        formDispatch({
          type: "editProduct",
          payload0: state.index,
          payload5: productState.name,
          payload2: amount,
          payload3: weight,
          payload4: price,
          payload6: signHint,
        });
      }

      setProductState("");
      setSignHint("");
      setAmount("");
      setWeight("");
      setPrice("");
    };

    return productState !== "" ? (
      <div className="IncludeproductInputEditor-wrapper">
        <span className="hint">ویرایش ردیف {state.index + 1}</span>
        <div className="IncludeproductInputEditor">
          <Input
            value={productState.name}
            label="شرح بار*"
            fun={(e) => {
              setProductState({ ...productState, name: e.target.value });
            }}
          />
          <Input
            value={signHint}
            label="علامت"
            fun={(e) => {
              setSignHint(e.target.value);
            }}
          />
          <Input
            value={amount}
            label="تعداد"
            fun={(e) => {
              setAmount(e.target.value);
            }}
          />
          <Input
            value={weight}
            label="وزن"
            fun={(e) => {
              setWeight(e.target.value);
            }}
          />
          <ExpenseInput
            value={price}
            label="فی"
            fun={(e) => {
              setPrice(e.target.value);
            }}
          />
          <Button
            className="newFactorAddProductInputButton"
            disabled={!productState.name}
            onClick={editProductOfCar}
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
  }
);

export default CarProductInputEditor;
