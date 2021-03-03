import React, {useContext} from 'react';
import ScreenTitle from '../../Components/ScreenTitle.jsx';
import {Link} from "react-router-dom";
import Button from '@material-ui/core/Button';

export default function Reports() {
  return (
    <div>
      <ScreenTitle title='گزارش گیری' />
      <Link to='/searchProducts'><Button variant="outlined">صافی ها</Button></Link>
      صافی |‌ نسیه ها |‌ نقدی ها
    </div>
  )
}