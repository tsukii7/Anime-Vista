import { useEffect, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';
import { getCurrentUser, isLoggedIn } from "../../firebase/auth.js";
import { hashUidToNumber } from "../../firebase/db.js";
import { useNavigate } from "react-router";
import SearchBar from "./SearchBar.jsx";
import { signOutUser } from "../../models/authentication/loginSlice.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import TranslateIcon from '@mui/icons-material/Translate';
import './TopBar.css';
import { useDispatch } from "react-redux";

const TopBar = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [mounted, setMounted] = useState(false);
    const dispatch = useDispatch();
    const { lang, setLang, t } = useLanguage();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleUserClick = (event) => {
        if (isLoggedIn()) {
            setAnchorEl(event.currentTarget);
        } else {
            navigate('/login');
        }
    };

    const handleClose = () => setAnchorEl(null);

    const handleGoHome = () => {
        const user = getCurrentUser();
        if (!user) return;
        navigate(`/${hashUidToNumber(user.userId)}`);
        handleClose();
    };

    const handleLogout = () => {
        dispatch(signOutUser());
        navigate('/');
        handleClose();
    };

    return (
        <header className="topbar">
            <button
                type="button"
                className="topbar-logo"
                onClick={() => navigate('/')}
                aria-label={t('nav.home')}
            >
                AnimeVista
            </button>
            <SearchBar />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                    className="lang-button"
                    onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
                    aria-label={t('common.switchLanguage')}
                >
                    <TranslateIcon fontSize="small" />
                    {lang === 'en' ? t('common.langZhShort') : t('common.langEnShort')}
                </button>
                <button
                    className="user-button"
                    onClick={handleUserClick}
                    aria-label={t('nav.myProfile')}
                    aria-haspopup="menu"
                    aria-expanded={Boolean(anchorEl)}
                >
                    <Person2RoundedIcon className="user-icon" />
                </button>
                {
                    mounted && isLoggedIn() && (
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem onClick={handleGoHome}>{t('nav.myProfile') || 'My Profile'}</MenuItem>
                            <MenuItem onClick={handleLogout}>{t('me.logout')}</MenuItem>
                        </Menu>
                    )
                }

            </div>
        </header>
    );
};


export default TopBar;
