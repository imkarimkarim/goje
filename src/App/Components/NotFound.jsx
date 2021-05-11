import React from "react";
import ErrorIcon from "@material-ui/icons/Error";
import Nav from "./Nav.jsx";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div>
      <Nav title="خطا" />
      <div className="notFound">
        <ErrorIcon />
        <p className="hint">مشکلی پیش آمده است! با پشتیبانی تماس بگیرید.</p>
      </div>
    </div>
  );
}
