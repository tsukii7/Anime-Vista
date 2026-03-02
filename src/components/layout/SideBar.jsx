import { NavLink } from 'react-router';
import './SideBar.css';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SignalCellularAltRoundedIcon from '@mui/icons-material/SignalCellularAltRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import { clearFilters } from "../../models/search/filterSlice.js";
import { useDispatch } from 'react-redux';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

const SideBar = ({ open, onClose }) => {
    const { t } = useLanguage();
    const dispatch = useDispatch();

    const handleNav = () => {
        onClose?.();
    };

    const handleSearch = () => {
        dispatch(clearFilters());
        onClose?.();
    };

    return (
        <nav className={`sidebar ${open ? 'sidebar-open' : ''}`}>
            <NavLink to="/" className="nav-item" onClick={handleNav}>
                <HomeRoundedIcon className="nav-icon" />
                <span className="nav-label">{t('nav.home')}</span>
            </NavLink>
            <NavLink to="/current" className="nav-item" onClick={handleNav}>
                <Inventory2RoundedIcon className="nav-icon" />
                <span className="nav-label">{t('nav.current')}</span>
            </NavLink>
            <NavLink to="/search" className="nav-item" onClick={handleSearch}>
                <SearchRoundedIcon className="nav-icon" />
                <span className="nav-label">{t('nav.search')}</span>
            </NavLink>
            <NavLink to="/rank" className="nav-item" onClick={handleNav}>
                <SignalCellularAltRoundedIcon className="nav-icon" />
                <span className="nav-label">{t('nav.rank')}</span>
            </NavLink>
            <NavLink to="/about" className="nav-item" onClick={handleNav}>
                <GroupsRoundedIcon className="nav-icon" />
                <span className="nav-label">{t('nav.about')}</span>
            </NavLink>
        </nav>
    );
};

export default SideBar;
