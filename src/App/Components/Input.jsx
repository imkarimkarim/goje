import React from "react";
import TextField from "@material-ui/core/TextField";

 const Input = React.memo(({label, fun, value, id}) => {
   id = (id) ? id : 'outlined-basic';
  return (
    <TextField
      id={id}
      size="small"
      variant="outlined"
      value={value}
      onChange={fun}
      label={label}
    />
  );
});
 
export default Input;
