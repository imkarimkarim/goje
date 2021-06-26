import React, { useState } from "react";
import "./Notif.css";
import WarningIcon from '@material-ui/icons/Warning';
import DoneIcon from '@material-ui/icons/Done';

export default function Notif({ type, message }) {
  const [showNotif, setShowNotif] = useState(true);

  setTimeout(function () {
    setShowNotif(false);
  }, 5000);

  let notif;
  if(type === 'success') {
    notif = <div className='notif notif-success'><DoneIcon />{message}</div>
  }
  if(type === 'error') {
    notif = <div className='notif notif-error'><WarningIcon />{message}</div>
  }

  return (
    <div>
      {showNotif ? (
        notif
      ) : (
        <div></div>
      )}
    </div>
  );
}
