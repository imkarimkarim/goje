import React from "react";
import { cleanTime, oneDay } from "../../utils";
import { DatePicker } from "jalali-react-datepicker";

export default function CustomeDatePicker({ search, setSearch }) {
  return (
    <div className="searchbox-datePicker">
      از تاریخ:
      <DatePicker
        timePicker={false}
        value={search.fromm}
        onClickSubmitButton={({ value }) => {
          setSearch({
            ...search,
            fromm: cleanTime(value._d.getTime()),
          });
        }}
      />
      تا تاریخ:
      <DatePicker
        timePicker={false}
        value={search.till}
        onClickSubmitButton={({ value }) => {
          setSearch({
            ...search,
            till: cleanTime(value._d.getTime()) + oneDay,
          });
        }}
      />
    </div>
  );
}
