import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { DatePicker } from "jalali-react-datepicker";
import JDate from "jalali-date";
import "./SearchBox.css";


const SearchBox = React.memo(({ defaultState, placeholder, onSubmit, label1, label2 }) => {
  const [searchState, setSearchState] = useState(defaultState);

  return (
    <div className="SearchBox">
      <TextField
        id="standard-basic"
        label="جستجو..."
        placeholder={placeholder}
        onChange={(e) => {
          setSearchState({ ...searchState, text: e.target.value });
        }}
      />
      <div className="labels">
        <FormControlLabel
          control={
            <Checkbox
              checked={searchState.checked1}
              onChange={(e) => {
                setSearchState({
                  ...searchState,
                  checked1: !searchState.checked1,
                });
              }}
              color="primary"
            />
          }
          label={label1}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={searchState.checked2}
              onChange={(e) => {
                setSearchState({
                  ...searchState,
                  checked2: !searchState.checked2,
                });
              }}
              color="primary"
            />
          }
          label={label2}
        />
      </div>
      <div className="searchbox-datePicker">
        از تاریخ:
        <DatePicker
          timePicker={false}
          value={searchState.fromm}
          onClickSubmitButton={({ value }) => {
            setSearchState({ ...searchState, fromm: value._d.getTime() });
          }}
        />
        تا تاریخ:
        <DatePicker
          timePicker={false}
          value={searchState.till}
          onClickSubmitButton={({ value }) => {
            setSearchState({ ...searchState, till: value._d.getTime() });
          }}
        />
      </div>
      <IconButton
        onClick={() => {
          onSubmit(searchState);
        }}
      >
        <SearchIcon />
      </IconButton>
    </div>
  );
});

export default SearchBox;