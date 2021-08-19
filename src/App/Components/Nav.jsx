import React, { useState } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import HomeIcon from "@material-ui/icons/Home";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import NoteIcon from "@material-ui/icons/Note";
import { Redirect } from "react-router-dom";

import { Link } from "react-router-dom";
import "./Nav.css";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const fidnParentPath = (path) => {
  const extractParentPath = (path) => {
    return "/" + path.split("/")[1];
  };
  const extractChildPath = (path) => {
    return "/" + path.split("/")[2];
  };

  if (path === "/welcome") return "/welcome";
  else if (path === "/includeCar") return "/welcome";
  else if (path === "/newFactor") return "/welcome";
  else if (path === "/newName") return "/welcome";
  else if (path === "/reports") return "/welcome";
  else if (path === "/searchProducts") return "/reports";
  else if (path === "/searchCars") return "/reports";
  else if (path === "/searchFactors") return "/reports";
  else if (extractParentPath(path) === "/product") return "/searchProducts";
  else if (extractParentPath(path) === "/car") return "/searchCars";
  else if (extractParentPath(path) === "/factor") return "/searchFactors";
  else if (extractParentPath(path) === "/editFactor")
    return "/factor" + extractChildPath(path);
  else if (extractParentPath(path) === "/editProduct")
    return "/product" + extractChildPath(path);
  else if (extractParentPath(path) === "/editCar")
    return "/car" + extractChildPath(path);
  else if (extractParentPath(path) === "/productDetails")
    return "/product" + extractChildPath(path);
  else return "/welcome";
};

export default function Nav({ title, history }) {
  const [anchorEl, setAnchorEl] = useState();
  const [goBack, setGoBack] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {goBack ? (
        <Redirect to={fidnParentPath(history.location.pathname)} />
      ) : (
        <nav>
          <ArrowForwardIcon
            color="action"
            className="goBack"
            fontSize="large"
            onClick={() => {
              setGoBack(true);
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
                <Link to="/searchCars">
                  <ShoppingCartIcon />
                  صافی ها
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
      )}
    </div>
  );
}
