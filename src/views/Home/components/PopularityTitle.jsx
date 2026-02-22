// src/views/Home/components/PopularityTitle.jsx
import React from 'react';
import styles from '../HomeView.module.css';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

const PopularityTitle = () => {
    const { t } = useLanguage();
    return (
        <div className={styles.popularityTitle}>
            <h2>{t('home.trendingNow')}</h2>
        </div>
    );
};

export default PopularityTitle;
