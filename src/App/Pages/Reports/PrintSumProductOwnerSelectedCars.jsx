const { ipcRenderer } = require("electron");
import React, { useRef, useEffect, useContext } from "react";
import { Redirect, useParams } from "react-router-dom";
import Header from "../../Components/Header.jsx";
import Footer from "../../Components/Footer.jsx";
import { NotifContext } from "../../Contexts/NotifContext.jsx";
import Expense from "../../Components/Expense.jsx";
import { Grid } from "@material-ui/core";
import html2pdf from "html2pdf.js";
import JDate from "jalali-date";
import { useState } from "react";
import Loading from "../../Components/Loading.jsx";
import ShowDate from "../../Components/ShowDate.jsx";

function SaleSection({ cars, ownerName }) {
  const [goBack, setGoBack] = useState(false);

  let fullSum = 0;
  for (let car of cars) {
    fullSum += car.ownerEarnings;
  }

  useEffect(() => {
    if (!goBack) {
      const jdate = new JDate();
      const fileName = `صورتحساب های ${ownerName} - ${jdate.format(
        "DD MMMM YYYY"
      )}.pdf`;
      const options = {
        jsPDF: { format: "a5" },
        filename: fileName,
        html2canvas: { scale: 1 },
      };
      html2pdf()
        .set(options)
        .from(document.body)
        .save()
        .then(() => {
          setGoBack(true);
        });
    }
  });

  return (
    <div>
      {goBack ? (
        <Redirect to="/welcome" />
      ) : (
        <div className="sale">
          <Grid container spacing={1}>
            <Grid className="saleInfo-table" item xs={9}>
              <table>
                <thead>
                  <tr>
                    <th>ردیف</th>
                    <th>تاریخ ورود</th>
                    <th>پلاک</th>
                    <th>اعلام صافی</th>
                    <th>صافی(ريال)</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{<ShowDate timestamp={car.arrivalDate} />}</td>
                        <td>{car.plaque}</td>
                        <td>{<ShowDate timestamp={car.printDate} />}</td>
                        <td>{<Expense num={car.ownerEarnings} />}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Grid>
          </Grid>
          <div className="owner-earning-car">
            <h3>
              <span>مجموع صافی ها</span>
              <span> :</span>
              <span>
                <Expense num={fullSum} />
              </span>
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PrintSumProductOwnerSelectedCars() {
  const { clearNotifs } = useContext(NotifContext);
  let { ownerName, selectedCars } = useParams();
  selectedCars = selectedCars.split(",");
  const init = useRef(true);

  const [cars, setCars] = useState();

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
      setCars(cars.reverse());
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("sumProductOwnerSelectedCars");
    };
  });
  const currentDate = new Date(new JDate()._d).getTime();

  return cars && cars.length >= 2 ? (
    <div>
      <div className="printCar">
        <Header />

        <div className="info">
          <p className="safiTitle">
            <span>صورتحساب</span>
            <span> </span>
            <span>
              <h3>{ownerName}</h3>
            </span>
          </p>
        </div>
        <div>
          <span>تاریخ گزارش</span>
          <span> :</span>
          <span>
            <ShowDate timestamp={currentDate} />
          </span>
        </div>

        <br />
        <SaleSection cars={cars} ownerName={ownerName} />
        <Footer />
      </div>
    </div>
  ) : (
    <Loading />
  );
}
