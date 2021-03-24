import React, {useState} from 'react';
import {Link} from "react-router-dom";
import Button from '@material-ui/core/Button';
import { DatePicker } from "jalali-react-datepicker";
import Nav from "../../Components/Nav.jsx";

export default function Reports() {
  
  const [date, setDate] = useState(Date.now());
  const [date2, setDate2] = useState(Date.now());
  
  return (
    <div className="reports-screen">
      <Nav title="/گزارشات" />
      <h3>جستجو</h3>
      <Link to='/searchProducts'><Button variant="outlined">جستجوی صافی</Button></Link>
      <Link to='/searchFactors'><Button variant="outlined">جستجوی فاکتور</Button></Link>
      <div className="printSection">
        <h3>گزارش گیری</h3>
        <div className="searchbox-datePicker">
          از:          
          <DatePicker
            value={date}
            onClickSubmitButton={({ value }) => {
              setDate(value._d.getTime());
            }}
          />
        تا:
        <DatePicker
          value={date2}
          onClickSubmitButton={({ value }) => {
            setDate2(value._d.getTime());
          }}
        />
        </div>
        <Link to={'/printFactors/' + date + '/' + date2}><Button variant="outlined">گزارش بگیر!</Button></Link>
      </div>
    </div>
  )
}