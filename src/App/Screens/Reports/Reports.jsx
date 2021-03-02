import React from 'react';
import ScreenTitle from '../../Components/ScreenTitle.jsx';
import {Link} from "react-router-dom";

export default function Reports() {
  return (
    <div>
      <ScreenTitle title='گزارش گیری' />
      <Link to='/searchFactors'>search factors</Link>
      صافی |‌ نسیه ها |‌ نقدی ها
    </div>
  )
}