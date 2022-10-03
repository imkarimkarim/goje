const { ipcRenderer } = require("electron");
import React, { useRef, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { NotifContext } from "../../Contexts/NotifContext.jsx";

export default function PrintSumProductOwnerSelectedCars() {
  const { clearNotifs } = useContext(NotifContext);
  let { ownerName, selectedCars } = useParams();
  selectedCars = selectedCars.split(",");
  const init = useRef(true);

  const sumProductOwnerSelectedCars = (carIds) => {
    ipcRenderer.send("sumProductOwnerSelectedCars", carIds);
  };

  useEffect(() => {
    if (init.current) {
      clearNotifs();
      sumProductOwnerSelectedCars(selectedCars);
      init.current = false;
    }

    ipcRenderer.on("sumProductOwnerSelectedCars", (event, cars) => {
      console.log(cars);
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("sumProductOwnerSelectedCars");
    };
  });

  return (
    <div>
      {ownerName}
      <br />
      {selectedCars}
    </div>
  );
}
