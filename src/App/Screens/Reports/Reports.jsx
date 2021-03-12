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
      <Link to='/searchProducts'><Button variant="outlined">جستجوی حساب</Button></Link>
      <h3>پرینت</h3>
      <Link to='/searchProducts'><Button variant="outlined">پرینت نسیه های روزانه</Button></Link>
      <Link to='/searchProducts'><Button variant="outlined">پرینت نسیه های تاریخ خاص</Button></Link>
      <h3>آمار روزانه</h3>
      <Link to='/searchProducts'><Button variant="outlined">آمار روزانه</Button></Link>
      <Link to='/searchProducts'><Button variant="outlined">آمار ماهانه</Button></Link>
      <Link to='/searchProducts'><Button variant="outlined">آمار سالانه</Button></Link>
    </div>
  )
}