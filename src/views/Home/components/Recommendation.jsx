// src/views/Home/components/Recommendation.jsx
import React from 'react';
import styles from '../HomeView.module.css';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import wallpaper from '../../../assets/wallpaper.jpeg'
const Recommendation = () => {
    const introText = [
        "Here is AnimeVista — your ultimate anime hub",
        "Catch the latest hits and seasonal gems in list or timeline view",
        "Dive into show details, rate, and review your favorites",
        "Post comments that sync with your personal feed — share the vibe",
        "Smart recommendations help you discover new anime you'll love",
        "Join the adventure — your anime world, your way"
    ];
    return (
        <div className={styles.recommendationWrapper}>
            <div className={styles.recommendationBanner}>
                <img
                    className={styles.recommendationImage}
                    src={wallpaper}
                    alt="Recommendation"
                />
                <div className={styles.recommendationOverlay}>
                    <div className={styles.recommendationText}>
                        <h2 className={styles.title}>Welcome to AnimeVista</h2>
                        <div>
                            {introText.map((text, index) => (
                                <p key={index} className={styles.introText}>
                                    {text}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recommendation;
