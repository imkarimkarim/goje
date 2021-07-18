import React, { createContext, useState, useEffect } from "react";

export const NotifContext = createContext();

export const NotifProvider = (props) => {
  const [notifs, setNotifs] = useState([]);

  const pushNotif = (type, message) => {
    if (
      notifs.length > 0 &&
      type !== notifs[notifs.length - 1].type &&
      message !== notifs[notifs.length - 1].message
    ) {
      setNotifs([{ type: type, message: message, id: notifs.length+1 }, ...notifs]);
    }
    if (notifs.length === 0) {
      setNotifs([...notifs, { type: type, message: message, id: notifs.length+1 }]);
    }
    setTimeout(function () {
      removeNotif(notifs.length+1);
    }, 7500);
  };

  const removeNotif = (index) => {
    let tmpNotif = [...notifs];
    tmpNotif.splice(tmpNotif.length-1);
    setNotifs(tmpNotif);
  };

  return (
    <NotifContext.Provider
      value={{ pushNotif: pushNotif, notifs: notifs }}
    >
      {props.children}
    </NotifContext.Provider>
  );
};
