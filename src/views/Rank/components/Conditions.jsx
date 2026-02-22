// src/views/Rank/components/Condition.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSortType, fetchRankingList } from '../../../models/rank/rankingSlice';
import styles from '../RankView.module.css';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

const Condition = () => {
    const dispatch = useDispatch();
    const { t } = useLanguage();
    const selectedSort = useSelector((state) => state.ranking.sortType);

    const SORT_OPTIONS = [
        { label: t('rank.trending') || 'Trending', value: 'TRENDING_DESC' },
        { label: t('rank.score') || 'Rating', value: 'SCORE_DESC' },
        { label: t('rank.popular') || 'Most Popular', value: 'POPULARITY_DESC' },
    ];

    const handleClick = (sortType) => {
        dispatch(setSortType(sortType));
        dispatch(fetchRankingList(sortType));
    };

    return (
        <div className={styles.conditionsContainer}>
            <div className={styles.tabsRow}>
                {SORT_OPTIONS.map(({ label, value }) => (
                    <div
                        key={value}
                        className={`${styles.tabItem} ${selectedSort === value ? styles.tabSelected : ''}`}
                        onClick={() => handleClick(value)}
                    >
                        <div className={styles.tabLabel}>{label}</div>
                        {selectedSort === value && <div className={styles.tabUnderline}></div>}
                    </div>
                ))}
            </div>
            <div className={styles.tabDivider}></div>
        </div>
    );
};

export default Condition;
