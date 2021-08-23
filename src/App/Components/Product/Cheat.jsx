import React, { useState, useEffect, useRef, useContext } from "react";
import DoneIcon from "@material-ui/icons/Done";
const { ipcRenderer } = require("electron");
import Button from "@material-ui/core/Button";
import Input from "../Input.jsx";
import ExpenseInput from "../ExpenseInput.jsx";
import { NotifContext } from "../../Contexts/NotifContext.jsx";
import "./Cheat.css";
import { convertToFloatIfIsNumber } from "../../utils.js";

// TODO: also up/down with arrow keys

const Cheat = React.memo(({ productId, setCountI }) => {
  const [amount, setAmount] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const { pushNotif } = useContext(NotifContext);

  const cheatProduct = () => {
    ipcRenderer.send("cheatProduct", {
      productId: productId,
      cheat: {
        amount: convertToFloatIfIsNumber(amount),
        weight: convertToFloatIfIsNumber(weight),
        price: convertToFloatIfIsNumber(price),
      },
    });
  };

  const removeCheatProduct = () => {
    ipcRenderer.send("removeCheatProduct", productId);
  };

  useEffect(() => {
    ipcRenderer.on("cheatProduct", (event, cheatStatus) => {
      if (cheatStatus.status !== null) {
        if (cheatStatus.status === true) {
          pushNotif("success", cheatStatus.message);
          setCountI(-1);
        } else if (cheatStatus.status === false) {
          pushNotif("error", cheatStatus.message);
        }
      }
    });

    ipcRenderer.on("removeCheatProduct", (event, cheatStatus) => {
      if (cheatStatus.status !== null && cheatStatus.status === true) {
        pushNotif("success", cheatStatus.message);
        setCountI(-1);
      }
    });
    // clean up
    return () => {
      ipcRenderer.removeAllListeners("cheatProduct");
    };
  });

  return productId ? (
    <div className="cheat-wrapper">
      <span className="hint">
        مقادیر دلخواه را با دقت وارد کنید | (تغییر بار {productId})
      </span>
      <div className="cheatEditor">
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
          label="فی فروش*"
          fun={(e) => {
            setPrice(e.target.value);
          }}
        />
        <Button
          className="newFactorAddProductInputButton"
          disabled={
            !(amount.length >= 0 && weight.length >= 1 && price.length >= 1)
          }
          onClick={cheatProduct}
          variant="outlined"
          color="primary"
        >
          <DoneIcon />
        </Button>
      </div>
      <Button
        className="deleteCheats"
        onClick={removeCheatProduct}
        variant="outlined"
        color="secondary"
      >
        حذف مقادیر دلخواه
      </Button>
    </div>
  ) : (
    <div></div>
  );
});

export default Cheat;
