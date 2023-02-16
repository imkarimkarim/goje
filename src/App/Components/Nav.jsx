import React, { useState, useContext } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import HomeIcon from "@material-ui/icons/Home";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import Person from "@material-ui/icons/Person";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import NoteIcon from "@material-ui/icons/Note";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { PathStackContext } from "../Contexts/PathStackContext.jsx";
import "./Nav.css";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

export default function Nav({ history }) {
    const [anchorEl, setAnchorEl] = useState();
    const [goBack, setGoBack] = useState(false);
    const { setCurrentPath, getBackPath } = useContext(PathStackContext);

    setCurrentPath(history.location.pathname);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            {goBack ? (
                <Redirect to={getBackPath()} />
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
                        <div aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                            <MenuIcon color="action" fontSize="large" />
                        </div>
                        <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
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
                            <MenuItem onClick={handleClose}>
                                <Link to="/editVisibleNames/customers">
                                    <Person />
                                    ویرایش نام مشتری ها
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <Link to="/editVisibleNames/productOwners">
                                    <Person />
                                    ویرایش نام صاحب بار ها
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
