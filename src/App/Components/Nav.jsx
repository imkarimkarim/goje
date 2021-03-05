import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import {Link} from "react-router-dom";
import './Nav.css';

export default function Nav({title}) {
  return (
    <nav>
      <Link to='/welcome'>
        <HomeIcon color="action" fontSize="large"/>
      </Link>
      <span className="screen-title">{title}</span>
    </nav>
  )
}