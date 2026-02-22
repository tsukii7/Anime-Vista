import React, { useState } from 'react';
import { addFavorite, removeFavorite } from "../firebase/db.js";
import { getCurrentUser, isLoggedIn } from "../firebase/auth.js";
import styles from './FavoriteBtn.module.css';
import { useLanguage } from '../i18n/LanguageContext.jsx';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Portal from '@mui/material/Portal';

const FavoriteBtn = ({ isFavorite, id }) => {
    const [showAlert, setShowAlert] = useState(false);
    const { t } = useLanguage();

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
            <button className={styles.heartBtn} onClick={handleFavoriteClickACB}>
                {isFavorite ? (
                    <FavoriteIcon className={styles.heartFilled} />
                ) : (
                    <FavoriteBorderIcon className={styles.heartOutlined} />
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
