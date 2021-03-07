import React from "react";
import TextField from "@material-ui/core/TextField";
import Expense from './Expense.jsx';
import './ExpenseInput.css';

 const ExpenseInput = React.memo(({label, fun, value}) => {
  return (
    <span className="expenseInput">
    <TextField
      id="outlined-basic"
      size="small"
      variant="outlined"
      value={value}
      onChange={fun}
      label={label}
    />
  <span className="expense-input-sub hint"><Expense num={value} /></span>
  </span>
  );
});
 
export default ExpenseInput;
