import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {Link} from "react-router-dom";
import './Nav.css';

export default function Nav({title}) {
  return (
    <nav>
      <ArrowForwardIcon color="action" fontSize="large" onClick={() => {window.history.back();}}/>
      <Link to='/welcome'>
        <HomeIcon color="action" fontSize="large"/>
      </Link>
      <span className="screen-title">{title}</span>
    </nav>
  )
}