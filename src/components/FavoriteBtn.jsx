import React, { useState } from 'react';
import { addFavorite, removeFavorite } from "../firebase/db.js";
import { getCurrentUser, isLoggedIn } from "../firebase/auth.js";
import styles from './FavoriteBtn.module.css';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const FavoriteBtn = ({ isFavorite, id }) => {
    const [showAlert, setShowAlert] = useState(false);

    async function handleFavoriteClickACB(event) {
        event.preventDefault();

        if (!isLoggedIn()) {
            setShowAlert(true);
            return;
        }

        const userId = getCurrentUser().userId;
        if (isFavorite) {
            await removeFavorite(userId, id);
        } else {
            await addFavorite(userId, id);
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
                    Please login to add to favorites
                </Alert>
            </Snackbar>
        </>
    );
};

export default FavoriteBtn;
