import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';
import { getCurrentUser, isLoggedIn } from "../../firebase/auth.js";
import { hashUidToNumber } from "../../firebase/db.js";
import { useNavigate } from "react-router";
import SearchBar from "./SearchBar.jsx";
import {signOutUser} from "../../models/authentication/loginSlice.js";
import './TopBar.css';
import {useDispatch} from "react-redux";

const TopBar = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();

    const handleUserClick = (event) => {
        if (isLoggedIn()) {
            setAnchorEl(event.currentTarget);
        } else {
            navigate('/login');
        }
    };

    const handleClose = () => setAnchorEl(null);

    const handleGoHome = () => {
        navigate(`/${hashUidToNumber(getCurrentUser().userId)}`);
        handleClose();
    };

    const handleLogout = () => {
        dispatch(signOutUser());
        navigate('/');
        handleClose();
    };

    return (
        <header className="topbar">
            <div className="topbar-logo" onClick={() => navigate('/')}>AnimeVista</div>
            <SearchBar/>
            <div>
                <button className="user-button" onClick={handleUserClick}>
                    <Person2RoundedIcon className="user-icon" />
                </button>
                {
                    isLoggedIn() && (
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem onClick={handleGoHome}>My Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    )
                }

            </div>
        </header>
    );
};

export default TopBar;
