import React, {useState} from 'react';
import {Link} from "react-router-dom";
import Button from '@material-ui/core/Button';
import { DatePicker } from "jalali-react-datepicker";
import Nav from "../../Components/Nav.jsx";

export default function Reports() {
  
  const [date, setDate] = useState();
  return (
    <div className="reports-screen">
      <Nav title="/گزارش گیری" />
      <h3>جستجو</h3>
      <Link to='/searchProducts'><Button variant="outlined">جستجوی صافی</Button></Link>
      <Link to='/searchFactors'><Button variant="outlined">جستجوی فاکتور</Button></Link>
      <div className="printSection">
        <h3>پرینت</h3>
        <div className="searchbox-datePicker">
          گزارش روزانه:
          <DatePicker
            timePicker={false}
            value={date}
            onClickSubmitButton={({ value }) => {
              setDate(value._d.getTime());
            }}
          />
        </div>
        <Link to={'/printFactors/'+date}><Button variant="outlined">پرینت بگیر!</Button></Link>
      </div>
    </div>
  )
}