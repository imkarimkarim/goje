import React from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./Loading.css";

export default function Loading({ history }) {
  return (
    <div className="loadingLoading">
      <CircularProgress />
      <p className="hint">درحال دریافت اطلاعات...</p>
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
  );
}
