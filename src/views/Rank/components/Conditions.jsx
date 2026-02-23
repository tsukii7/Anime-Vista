// src/views/Rank/components/Condition.jsx
import { useDispatch, useSelector } from 'react-redux';
import { setSortType } from '../../../models/rank/rankingSlice';
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
    };

    return (
        <div className={styles.conditionsContainer}>
            <div className={styles.tabsRow}>
                {SORT_OPTIONS.map(({ label, value }) => (
                    <button
                        type="button"
                        key={value}
                        className={`${styles.tabItem} ${selectedSort === value ? styles.tabSelected : ''}`}
                        onClick={() => handleClick(value)}
                        aria-pressed={selectedSort === value}
                    >
                        <div className={styles.tabLabel}>{label}</div>
                        {selectedSort === value && <div className={styles.tabUnderline}></div>}
                    </button>
                ))}
            </div>
            <div className={styles.tabDivider}></div>
        </div>
    );
};

export default Condition;
