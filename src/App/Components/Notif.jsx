import React, { useContext } from "react";
import "./Notif.css";
import WarningIcon from "@material-ui/icons/Warning";
import DoneIcon from "@material-ui/icons/Done";
import { NotifContext } from "../Contexts/NotifContext.jsx";

export default function Notif() {
  const { notifs } = useContext(NotifContext);

  return (
    <div className="notif">
      {notifs && notifs.length > 0 ? (
        notifs.map((notif) => {
          let tmpNotif;
          if (notif.type === "success") {
            tmpNotif = (
              <div className="notif-success">
                <h3>
                  <DoneIcon />
                  انجام شد
                </h3>
                {notif.message}
              </div>
            );
          }
          if (notif.type === "error") {
            tmpNotif = (
              <div className="notif-error">
                <h3>
                  <WarningIcon />
                  خطا
                </h3>
                {notif.message}
              </div>
            );
          }
          return tmpNotif;
        })
      ) : (
        <div></div>
      )}
    </div>
  );
}
