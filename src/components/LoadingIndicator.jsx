import React from 'react';
import '../styles/global.css';
import miku_loading from '../assets/miku-loading.gif'
import miku_running from '../assets/miku-running.gif'
import miku_crying from '../assets/miku-crying.gif'
import { useLanguage } from '../i18n/LanguageContext.jsx';

const LoadingIndicator = ({ isLoading = true, hasError = false, text = '' }) => {
    const { t } = useLanguage();
    if (!isLoading && !hasError) return null;

    return (
        <div className="loadingContainer">
            <h3 className="loadingText">
                {text ? text : (hasError ? t('common.error') || "Oops! Something went wrong..." : t('common.loading') || "Just a moment... Miku is spinning up the data!")}
            </h3>
            <img
                src={hasError ? miku_crying : Math.random() > 0.5 ? miku_loading : miku_running} className="loadingImg"
                alt={hasError ? "Error" : "Loading..."}
            />
        </div>
    );
};


export default LoadingIndicator;
