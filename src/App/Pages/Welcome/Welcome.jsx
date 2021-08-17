import React from "react";
// TODO: add: (سایت گوجه +‌ آموزش استفاده)
import { Link } from "react-router-dom";
import Box from "@material-ui/core/Box";
import "./Welcome.css";
import Button from "@material-ui/core/Button";
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import Nav from '../../Components/Nav.jsx';

export default function Welcome() {
  return (
    <div className="welcome-screen">
    <Nav />
      <div className="welcome-message">
        <h2>به <span className='goje'>گوجه</span> خوش اومدی...</h2>
      </div>
      <div className="usefull-links_wrapper">
        <Link className="usefull-link" to="/newFactor">
          <span className="customButton">
            <Button variant="outlined">
              <span className="button-icon"><NoteAddIcon /></span>
              <span className="button-title">فاکتور جدید</span>
            </Button>
          </span>
        </Link>

        <Link className="usefull-link" to="/includeProduct">
          <span className="customButton">
            <Button variant="outlined">
              <span className="button-icon"><ImportExportIcon /></span>
              <span className="button-title">ورود بار</span>
            </Button>
          </span>
        </Link>

        <Link className="usefull-link" to="/newName">
          <span className="customButton">
            <Button variant="outlined">
              <span className="button-icon"><PersonAddIcon /></span>
              <span className="button-title">نام جدید</span>
            </Button>
          </span>
        </Link>

        <Link className="usefull-link" to="/reports">
          <span className="customButton">
            <Button variant="outlined">
              <span className="button-icon"><EqualizerIcon /></span>
              <span className="button-title">گزارشات</span>
            </Button>
          </span>
        </Link>
      </div>
    </div>
  );
}
