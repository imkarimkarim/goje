import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
const { ipcRenderer } = require("electron");
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import DescriptionIcon from "@material-ui/icons/Description";
import CloseIcon from "@material-ui/icons/Close";
import PrintIcon from "@material-ui/icons/Print";
import PrintDisabledIcon from "@material-ui/icons/PrintDisabled";
import SearchResultItem from "../../Components/Report/SearchResultItem.jsx";
import Loading from "../../Components/Loading.jsx";
import Nav from "../../Components/Nav.jsx";
import SearchBox from "../../Components/Report/SearchBox.jsx";
import JDate from "jalali-date";
import ShowDate from "../../Components/ShowDate.jsx";
import "./SearchProducts.css";
import { cleanTime, oneDay, oneYear, productsToString } from "../../utils.js";

const defalutSearchState = {
  text: "",
  checked1: true,
  checked2: false,
  fromm: cleanTime(Date.now() - oneYear),
  till: cleanTime(Date.now()) + oneDay,
};

export default function SearchCars({ history }) {
  const [cars, setCars] = useState(false);
  const [searchState, setSearchState] = useState(defalutSearchState);
  const init = useRef(true);

  const handleNewSearch = (newSearchState) => {
    setSearchState(newSearchState);
    searchInCars(newSearchState);
  };

  const searchInCars = (newSearchState) => {
    ipcRenderer.send("searchInCars", newSearchState);
  };

  useEffect(() => {
    if (init.current) {
      searchInCars(defalutSearchState);
      init.current = false;
    }

    ipcRenderer.on("searchInCars", (event, findedCars) => {
      setCars(findedCars);
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("searchInCars");
    };
  });

  let resultsList;
  let filteredCars;
  filteredCars = cars;
  if (cars) {
    if (searchState.text.length > 0) {
      filteredCars = cars.filter((c) =>
        (
          c.customeId +
          " " +
          c.owner +
          " " +
          productsToString(c.products)
        ).includes(searchState.text)
      );
    }
    resultsList = filteredCars.map((car) => {
      const icon = car.isPrinted ? (
        <PrintIcon style={{ color: "blue" }} />
      ) : (
        <PrintDisabledIcon style={{ color: "gray" }} />
      );
      return (
        <div key={car.customeId}>
          <SearchResultItem
            itemTitle={
              <span>
                {" " +
                  car.owner +
                  " " +
                  "(" +
                  productsToString(car.products) +
                  ")"}
              </span>
            }
            titleHint={
              <span>
                <ShowDate timestamp={car.arrivalDate} />
                {car.plaque && " | " + car.plaque}
                {icon}
              </span>
            }
            customeId={car.customeId}
            to={`/car/${car.customeId}`}
          />
        </div>
      );
    });
  }

  return (
    <div>
      <Nav history={history} />
      <SearchBox
        defaultState={searchState}
        onSubmit={(newSearchState) => {
          handleNewSearch(newSearchState);
        }}
        label1="گزارش گرفته نشده"
        label2="گزارش گرفته شده"
        placeholder="شرح یا صاحب بار"
      />
      {cars ? (
        <div>
          <p className="hint">{`${resultsList.length} صافی پیدا شد.`}</p>
          <List>{resultsList}</List>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
