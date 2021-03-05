import React from 'react';
// TODO: add: (سایت گوجه +‌ آموزش استفاده)
import {Link} from "react-router-dom";
import Box from '@material-ui/core/Box';
import './Welcome.css';
import Button from '@material-ui/core/Button';

export default function Welcome() {
  return (<div>
    <div className='welcome-message'>
      <h2>به گوجه خوش اومدی...</h2>
    </div>
    <div className='usefull-links_wrapper'>
        <Link className='usefull-link' to='/newFactor'>
          <Button variant="outlined">فاکتور جدید
        </Button></Link>
      
        <Link className='usefull-link' to='/includeProduct'>
          <Button variant="outlined">وارد کردن بار
        </Button></Link>
      
        <Link className='usefull-link' to='/newCustomer'>
          <Button variant="outlined">مشتری جدید
        </Button></Link>
      
        <Link className='usefull-link' to='/reports'>
          <Button variant="outlined">گزارش گیری
        </Button></Link>
      
    </div>
  </div>);
}