import React from "react";
import JDate from "jalali-date";

export default function ShowDate({timestamp}) {
  const date = new JDate(new Date(timestamp));
  console.log(timestamp);
  console.log(date);
  return <span>
    <span>{date.date[0]}</span>
    <span>/</span>
    <span>{date.date[1]}</span>
    <span>/</span>
    <span>{date.date[2]}</span>
  </span>;
}
