import React, {useState} from 'react';
import {Link} from "react-router-dom";
import Button from '@material-ui/core/Button';
import Divider from "@material-ui/core/Divider";
import SubjectIcon from '@material-ui/icons/Subject';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SearchIcon from '@material-ui/icons/Search';
import NoteIcon from '@material-ui/icons/Note';
import { DatePicker } from "jalali-react-datepicker";
import DescriptionIcon from '@material-ui/icons/Description';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import Nav from "../../Components/Nav.jsx";
import './Reports.css';
import {cleanTime, oneDay} from '../../util.js';

export default function Reports() {

  const [date, setDate] = useState(cleanTime(Date.now()));

  return (
    <div className="reports-screen">
      <Nav title="/گزارشات" />
      <h3 className="alignTextIcon">جستجو<SearchIcon /></h3>
      <Link to='/searchProducts'><Button variant="outlined">بارها<ShoppingCartIcon /></Button></Link>
      <br />
      <Link to='/searchFactors'><Button variant="outlined">فاکتورها<NoteIcon /></Button></Link>
      <div className="printSection">
        <h3 className="alignTextIcon">گزارشات<EqualizerIcon /></h3>
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
        <Link to={'/printFactors/' + date + '/' + (parseInt(date)+oneDay)}><Button variant="outlined">گزارش!<DescriptionIcon /></Button></Link>
        <br />
        <br />
        از باقیمانده بار:
        <br />
        <Link to={'/printRemainingProducts/'}><Button variant="outlined">گزارش!<DescriptionIcon /></Button></Link>
      </div>
    </div>
  )
}
