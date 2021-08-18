import React from "react";
import ErrorIcon from "@material-ui/icons/Error";
import Button from "@material-ui/core/Button";
import Nav from "./Nav.jsx";
import "./NotFound.css";

export default function NotFound({ history }) {
  return (
    <div>
      <Nav history={history} />
      <div className="notFound">
        <ErrorIcon />
        <p className="hint">مشکلی پیش آمده است! با پشتیبانی تماس بگیرید.</p>
        <Button variant="outlined">
          <span
            className="button-title"
            onClick={() => {
              history.goBack();
            }}
          >
            انصراف
          </span>
        </Button>
      </div>
    </div>
  );
}
