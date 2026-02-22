import React from 'react';
import { NavLink } from 'react-router';
import './SideBar.css';

// MUI Icons
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SignalCellularAltRoundedIcon from '@mui/icons-material/SignalCellularAltRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import { clearFilters } from "../../models/search/filterSlice.js";
import { useDispatch } from 'react-redux';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

const SideBar = () => {
    const { t } = useLanguage();
    const dispatch = useDispatch();
    const handleSearch = () => {
        dispatch(clearFilters());
    };

    return (
        <nav className="sidebar">
            <NavLink to="/" className="nav-item">
                <HomeRoundedIcon className="nav-icon" />
                <span>{t('nav.home')}</span>
            </NavLink>
            <NavLink to="/current" className="nav-item">
                <Inventory2RoundedIcon className="nav-icon" />
                <span>{t('nav.current')}</span>
            </NavLink>
            <NavLink to="/search" className="nav-item" onClick={handleSearch}>
                <SearchRoundedIcon className="nav-icon" />
                <span>{t('nav.search')}</span>
            </NavLink>
            <NavLink to="/rank" className="nav-item">
                <SignalCellularAltRoundedIcon className="nav-icon" />
                <span>{t('nav.rank')}</span>
            </NavLink>
            <NavLink to="/about" className="nav-item">
                <GroupsRoundedIcon className="nav-icon" />
                <span>{t('nav.about')}</span>
            </NavLink>
        </nav>
    );
};

export default SideBar;
