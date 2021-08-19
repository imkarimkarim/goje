import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import SubjectIcon from "@material-ui/icons/Subject";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import AssignmentIcon from "@material-ui/icons/Assignment";
import SearchIcon from "@material-ui/icons/Search";
import NoteIcon from "@material-ui/icons/Note";
import { DatePicker } from "jalali-react-datepicker";
import DescriptionIcon from "@material-ui/icons/Description";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import Nav from "../../Components/Nav.jsx";
import "./Reports.css";
import { cleanTime, oneDay } from "../../utils.js";

export default function Reports({ history }) {
  const [date, setDate] = useState(cleanTime(Date.now()));

  return (
    <div className="reports-screen">
      <Nav history={history} />
      <div className="searchItemsWrapper">
        <h3 className="alignTextIcon">
          جستجو
          <SearchIcon />
        </h3>
        <div className="searchItems">
          <Link to="/searchFactors">
            <Button variant="outlined">
              فاکتورها
              <NoteIcon />
            </Button>
          </Link>
          <Link to="/searchProducts">
            <Button variant="outlined">
              بارها
              <ShoppingCartIcon />
            </Button>
          </Link>
          <Link to="/searchCars">
            <Button variant="outlined">
              صافی ها
              <AssignmentIcon />
            </Button>
          </Link>
          <br />
        </div>
      </div>
      <div className="printSection">
        <h3 className="alignTextIcon">
          گزارشات
          <EqualizerIcon />
        </h3>
        <div className="searchbox-datePicker">
          از نسیه های تاریخ:
          <DatePicker
            value={date}
            timePicker={false}
            onClickSubmitButton={({ value }) => {
              setDate(cleanTime(value._d.getTime()));
            }}
          />
        </div>
        <Link to={"/printFactors/" + date + "/" + (parseInt(date) + oneDay)}>
          <Button variant="outlined">
            گزارش!
            <DescriptionIcon />
          </Button>
        </Link>
        <br />
        <br />
        از باقیمانده بار:
        <br />
        <Link to={"/printRemainingProducts/"}>
          <Button variant="outlined">
            گزارش!
            <DescriptionIcon />
          </Button>
        </Link>
      </div>
    </div>
  );
}
