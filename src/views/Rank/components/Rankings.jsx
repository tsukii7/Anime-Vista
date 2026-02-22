import React from 'react';
import { useSelector } from 'react-redux';
import RankingCard from './RankingCard.jsx';
import styles from '../RankView.module.css';
import LoadingIndicator from "../../../components/LoadingIndicator.jsx";
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import { getDisplayTitle } from '../../../utils/animeUtils.js';

const Rankings = () => {
    const { list, status, currentPage, error } = useSelector((state) => state.ranking);
    const { lang, t } = useLanguage();
    const perPage = 15;

    if (status === 'loading') return <LoadingIndicator />;
    if (status === 'failed') return <LoadingIndicator isLoading={false} hasError={true} text={error || t('common.error') || "Oops! Something went wrong..."} />;

    const getHeaderColor = (rank) => {
        switch (rank) {
            case 1:
                return '#FF3B30'; // red
            case 2:
                return '#FF9500'; // orange
            case 3:
                return '#FFCC00'; // yellow
            default:
                return '#8E8E93'; // gray
        }
    };

    return (
        <div className={styles.rankingGrid}>
            {list.map((anime, idx) => {
                const globalRank = (currentPage - 1) * perPage + idx + 1;
                return (
                    anime && <RankingCard
                        key={anime?.id}
                        rank={globalRank}
                        anime={anime}
                        color={getHeaderColor(globalRank)}
                    />
                );
            })}
        </div>
    );
};

export default Rankings;
