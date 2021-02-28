import React from 'react';
// TODO: add: (سایت گوجه +‌ آموزش استفاده)
import {Link} from "react-router-dom";
import Box from '@material-ui/core/Box';
import './Welcome.css';

export default function Welcome() {
  return (<div>
    <div className='welcome-message'>
      <h2>به گوجه خوش اومدی...</h2>
    </div>
    <div className='usefull-links_wrapper'>
      <Link className='usefull-link' to='/newFactor'>فاکتور جدید</Link>
      |
      <Link className='usefull-link' to='/includeProduct'>وارد کردن بار</Link>
      |
      <Link className='usefull-link' to='/newCustomer'>مشتری جدید</Link>
      |
      <Link className='usefull-link' to='/reports'>گزارش گیری</Link>
    </div>
  </div>);
}