import * as React from 'react';
import { addFavorite, removeFavorite } from "../firebase/db.js";
import { getCurrentUser, isLoggedIn } from "../firebase/auth.js";
import styles from './FavoriteBtn.module.css';
import { useLanguage } from '../i18n/LanguageContext.jsx';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Portal from '@mui/material/Portal';

const FavoriteBtn = ({ isFavorite, id, variant = 'default' }) => {
    const [showAlert, setShowAlert] = React.useState(false);
    const { t } = useLanguage();
    const isOverlay = variant === 'overlay';
    const btnClass = `${styles.heartBtn} ${isOverlay ? styles.heartBtnOverlay : ''}`.trim();
    const filledClass = `${styles.heartFilled} ${isOverlay ? styles.heartFilledOverlay : ''}`.trim();
    const outlinedClass = `${styles.heartOutlined} ${isOverlay ? styles.heartOutlinedOverlay : ''}`.trim();

    async function handleFavoriteClickACB(event) {
        event.preventDefault();

        if (!isLoggedIn()) {
            setShowAlert(true);
            return;
        }

        try {
            const userId = getCurrentUser().userId;
            if (isFavorite) {
                await removeFavorite(userId, id);
            } else {
                await addFavorite(userId, id);
            }
        } catch (err) {
            console.error('Error updating favorite:', err);
        }
    }

    return (
        <>
            <button className={btnClass} onClick={handleFavoriteClickACB}>
                {isFavorite ? (
                    <FavoriteIcon className={filledClass} />
                ) : (
                    <FavoriteBorderIcon className={outlinedClass} />
                )}
            </button>

            <Portal>
                <Snackbar
                    open={showAlert}
                    autoHideDuration={3000}
                    onClose={() => setShowAlert(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        severity="warning"
                        onClose={() => setShowAlert(false)}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {t('common.loginToFavorite') || "Please login to add to favorites"}
                    </Alert>
                </Snackbar>
            </Portal>
        </>
    );
};

export default FavoriteBtn;
