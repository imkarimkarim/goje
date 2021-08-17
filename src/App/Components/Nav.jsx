import React from "react";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import HomeIcon from "@material-ui/icons/Home";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import NoteIcon from "@material-ui/icons/Note";

import { Link } from "react-router-dom";
import "./Nav.css";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

export default function Nav({ title }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav>
      <ArrowForwardIcon
        color="action"
        className="goBack"
        fontSize="large"
        onClick={() => {
          window.history.back();
        }}
      />
      <div>
        <Link to="/welcome">
          <HomeIcon color="action" fontSize="large" />
        </Link>
        <div
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MenuIcon color="action" fontSize="large" />
        </div>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <Link to="/welcome">
              <HomeIcon />
              خانه
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/reports">
              <EqualizerIcon />
              گزارشات
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/searchProducts">
              <ShoppingCartIcon />
              بارها
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/includeCar">
              <ImportExportIcon />
              ورود بار
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/searchFactors">
              <NoteIcon />
              فاکتورها
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/newFactor">
              <NoteAddIcon />
              فاکتور جدید
            </Link>
          </MenuItem>
        </Menu>
      </div>
      <Link to="/welcome"></Link>
    </nav>
  );
}
