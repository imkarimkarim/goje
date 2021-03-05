import React from "react";
import TextField from "@material-ui/core/TextField";

 const Input = React.memo(({label, fun, value}) => {
  return (
    <TextField
      id="outlined-basic"
      size="small"
      variant="outlined"
      value={value}
      onChange={fun}
      label={label}
    />
  );
});
 
export default Input;
