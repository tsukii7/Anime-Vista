// src/views/Home/components/Recommendation.jsx
import styles from '../HomeView.module.css';
import wallpaper from '../../../assets/wallpaper.jpeg'
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

const Recommendation = () => {
    const { t } = useLanguage();
    const introText = t('home.introText');

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
                        <h2 className={styles.title}>{t('home.welcome')}</h2>
                        <div>
                            {Array.isArray(introText) && introText.map((text, index) => (
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
