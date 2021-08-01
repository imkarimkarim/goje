import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { DatePicker } from "jalali-react-datepicker";
import JDate from "jalali-date";
import CustomerInput from "../Customer/CustomerInput.jsx";
import "./SearchBox.css";
import { cleanTime, oneDay } from "../../utils.js";

// TODO: search on enter

const SearchBox = React.memo(
  ({
    defaultState,
    placeholder,
    searchForCustomers,
    onSubmit,
    label1,
    label2,
  }) => {
    const [searchState, setSearchState] = useState(defaultState);

    let searchInput;
    if (searchForCustomers) {
      searchInput = (
        <CustomerInput
          label={placeholder}
          className="customeInputAndPicker"
          onPick={(id, name) => {
            setSearchState({ ...searchState, text: name });
          }}
          ownerName={searchState && searchState.text}
        />
      );
    } else {
      searchInput = (
        <TextField
          id="standard-basic"
          label="جستجو..."
          placeholder={placeholder}
          onChange={(e) => {
            setSearchState({ ...searchState, text: e.target.value });
          }}
        />
      );
    }

    return (
      <div className="SearchBox">
        {searchInput}
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
              setSearchState({
                ...searchState,
                fromm: cleanTime(value._d.getTime()),
              });
            }}
          />
          تا تاریخ:
          <DatePicker
            timePicker={false}
            value={searchState.till}
            onClickSubmitButton={({ value }) => {
              setSearchState({
                ...searchState,
                till: cleanTime(value._d.getTime()) + oneDay,
              });
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
  }
);

export default SearchBox;
