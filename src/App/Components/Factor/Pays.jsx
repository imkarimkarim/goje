/* eslint-disable react/display-name */
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import ExpenseInput from "../ExpenseInput.jsx";
import { DatePicker } from "jalali-react-datepicker";
import "./Pays.css";
import Expense from "../Expense.jsx";
import DeleteIcon from "@material-ui/icons/Delete";
import ShowDate from "../ShowDate.jsx";

const defaultState = {
  date: Date.now(),
  amount: "",
};

const PayInput = React.memo(({ onSubmit, pays, formDispatch }) => {
  const [state, setState] = useState(defaultState);

  const handleSubmit = () => {
    onSubmit(state);
    setState(defaultState);
  };

  return (
    <div className="pays-wrapper">
      {pays && pays.length > 0 ? (
        pays.map((py, index) => {
          return (
            <p className="payedRecord" key={index}>
              {<Expense num={py.amount} />}
              {" پرداخت شد. "}
              {"("}
              <ShowDate timestamp={py.date} />
              {")"}
              {formDispatch ? (
                <span
                  onDoubleClick={() =>
                    formDispatch({ type: "removePay", payload: index })
                  }
                >
                  {<DeleteIcon />}
                </span>
              ) : (
                ""
              )}
            </p>
          );
        })
      ) : (
        <div></div>
      )}
      {formDispatch && onSubmit ? (
        <div className="paysinput-wrapper">
          <DatePicker
            timePicker={false}
            value={state.date}
            onClickSubmitButton={({ value }) => {
              setState({ ...state, date: value._d.getTime() });
            }}
          />
          <ExpenseInput
            label="داده"
            fun={(e) => {
              setState({ ...state, amount: e.target.value });
            }}
            value={state.amount}
          />
          <Button
            className="newFactorAddProductInputButton"
            disabled={!(state.date && state.amount)}
            onClick={handleSubmit}
            variant="outlined"
            color="primary"
          >
            +
          </Button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
});

export default PayInput;
