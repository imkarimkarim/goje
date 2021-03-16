import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import Button from '@material-ui/core/Button';
import Nav from "../../Components/Nav.jsx";

export default function Reports() {
  return (
    <div className="reports-screen">
      <Nav title="/گزارش گیری" />
      <h3>جستجو</h3>
      <Link to='/searchProducts'><Button variant="outlined">جستجوی صافی</Button></Link>
      <Link to='/searchFactors'><Button variant="outlined">جستجوی فاکتور</Button></Link>
      <h3>پرینت</h3>
      <Link to='/print'><Button variant="outlined">پرینت نسیه های جدید</Button></Link>
    </div>
  )
}