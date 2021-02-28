import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import {Link} from "react-router-dom";

export default function Nav() {
  return (
    <Link to='/welcome'>
      <HomeIcon color="action" fontSize="large"/>
    </Link>
  )
}