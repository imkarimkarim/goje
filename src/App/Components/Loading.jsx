import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./Loading.css";
import { Redirect } from "react-router-dom";

export default function Loading() {
  const [goBack, setGoBack] = useState(false);

  return (
    <div>
      {goBack ? (
        <Redirect to="/welcome" />
      ) : (
        <div className="loadingLoading">
          <CircularProgress />
          <p className="hint">درحال دریافت اطلاعات...</p>
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
      )}
    </div>
  );
}
