// import { List } from "@material-ui/core";
import { Button, List } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../Components/Loading.jsx";
const { ipcRenderer } = require("electron");
import Nav from "../../Components/Nav.jsx";
import PrintIcon from "@material-ui/icons/Print";
import PrintDisabledIcon from "@material-ui/icons/PrintDisabled";
import SearchResultItem from "../../Components/Report/SearchResultItem.jsx";
import ShowDate from "../../Components/ShowDate.jsx";
import DescriptionIcon from "@material-ui/icons/Description";
import { productsToString } from "../../utils.js";

export default function SearchProductOwnerCars({ history }) {
  const init = useRef(true);
  let { id } = useParams();

  const getOneProductOwner = (id) => {
    ipcRenderer.send("getOneProductOwner", id);
  };

  const findProductOwnerCars = (id) => {
    ipcRenderer.send("findProductOwnerCars", id);
  };

  // get cars, list cars
  const [productOwner, setProductOwner] = useState(false);
  const [cars, setCars] = useState(false);
  const [checkeds, setCheckeds] = useState([]);

  useEffect(() => {
    if (init.current) {
      // get product owner + get her cars
      getOneProductOwner(id);
      init.current = false;
    }

    ipcRenderer.on("getOneProductOwner", (event, productOwner) => {
      init.current = false;
      setProductOwner(productOwner);
      findProductOwnerCars(productOwner.customeId);
    });

    ipcRenderer.on("findProductOwnerCars", (event, cars) => {
      setCars(cars);
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("getOneProductOwner");
      ipcRenderer.removeAllListeners("findProductOwnerCars");
    };
  });

  const toggleItems = (items, newItem) => {
    if (!items && !newItem) return;
    const index = items.indexOf(newItem);
    if (index < 0) {
      items = [...items, newItem];
    } else {
      items.splice(index, 1);
    }
    setCheckeds(items);
  };

  let resultsList;
  if (cars && cars.length > 0) {
    resultsList = cars.map((car) => {
      const icon = car.isPrinted ? (
        <PrintIcon style={{ color: "blue" }} />
      ) : (
        <PrintDisabledIcon style={{ color: "gray" }} />
      );
      const onChecked = car.isPrinted
        ? (checked) => {
            toggleItems(checkeds, checked);
          }
        : null;
      return (
        <div key={car.customeId}>
          <SearchResultItem
            itemTitle={
              <span>
                <ShowDate timestamp={car.arrivalDate} />
                {car.plaque && " | " + car.plaque}
              </span>
            }
            customeId={car.customeId}
            titleHint={
              <span>
                ({productsToString(car.products)}){icon}
              </span>
            }
            to={`/car/${car.customeId}`}
            onChecked={onChecked}
          />
        </div>
      );
    });
  }

  return productOwner && resultsList ? (
    <div>
      <Nav history={history} />
      <div>
        <p className="car-safiTitle">
          <span>بارهای</span>
          <span> </span>
          <span>
            <h3>{productOwner.name}</h3>
          </span>
        </p>
        <p className="hint">{`${resultsList.length} صافی موجود است.`}</p>
        {resultsList ? <List>{resultsList}</List> : <></>}
        {checkeds && checkeds.length > 1 ? (
          <div className="advanceProductsPrint">
            <Link
              to={
                "/printSumProductOwnerSelectedCars/" +
                productOwner.name +
                "/" +
                checkeds.toString()
              }
            >
              <Button
                className="newProductAddProductInputButton"
                variant="contained"
                color="primary"
              >
                جمع
                <DescriptionIcon />
              </Button>
            </Link>
          </div>
        ) : (
          <span></span>
        )}
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
    </div>
  ) : (
    <Loading />
  );
}
