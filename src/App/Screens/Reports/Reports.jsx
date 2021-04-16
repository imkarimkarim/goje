import React, {useState} from 'react';
import {Link} from "react-router-dom";
import Button from '@material-ui/core/Button';
import { DatePicker } from "jalali-react-datepicker";
import DescriptionIcon from '@material-ui/icons/Description';
import Nav from "../../Components/Nav.jsx";
import './Reports.css';
import {cleanTime, oneDay} from '../../util.js';

export default function Reports() {
  
  const [date, setDate] = useState(cleanTime(Date.now()));
  
  return (
    <div className="reports-screen">
      <Nav title="/گزارشات" />
      <h3>جستجو</h3>
      <Link to='/searchProducts'><Button variant="outlined">جستجوی صافی</Button></Link>
      <Link to='/searchFactors'><Button variant="outlined">جستجوی فاکتور</Button></Link>
      <div className="printSection">
        <h3>گزارشات</h3>
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
        <Link to={'/printFactors/' + date + '/' + (parseInt(date)+oneDay)}><Button variant="outlined">گزارش بگیر!<DescriptionIcon /></Button></Link>
      </div>
    </div>
  )
}