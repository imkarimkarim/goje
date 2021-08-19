import React, { useState } from "react";
import ErrorIcon from "@material-ui/icons/Error";
import Button from "@material-ui/core/Button";
import Nav from "./Nav.jsx";
import "./NotFound.css";
import { Redirect } from "react-router-dom";


export default function NotFound({ history }) {
  const [goBack, setGoBack] = useState(false);
  return (
    <div>
      {goBack ? (
        <Redirect to="/welcome" />
      ) : (
        <div>
          <Nav history={history} />
          <div className="notFound">
            <ErrorIcon />
            <p className="hint">مشکلی پیش آمده است! با پشتیبانی تماس بگیرید.</p>
            <Button variant="outlined">
              <span
                className="button-title"
                onClick={() => {
                  setGoBack(true);
                }}
              >
                انصراف
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
