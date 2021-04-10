import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Loading.css';

export default function Loading() {
  return(
    <div className="loadingLoading">
      <CircularProgress />
      <p className="hint">
        درحال دریافت اطلاعات...
      </p>
    </div>
  )
}