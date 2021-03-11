import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import Button from '@material-ui/core/Button';
import Nav from "../../Components/Nav.jsx";

export default function Reports() {
  return (
    <div className="reports-screen">
      <Nav title="/گزارش گیری" />
      <Link to='/searchProducts'><Button variant="outlined">صافی ها</Button></Link>
    </div>
  )
}