import React from 'react';
import styles from './Statistics.module.css';
import { FaStar, FaRegHeart } from 'react-icons/fa';
import { MdShowChart } from 'react-icons/md';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

const Statistics = ({ statistics }) => {
    const { t } = useLanguage();
    return (
        <div className={styles.container}>
            <div className={styles.title}>{t('details.statistic') || 'Statistics'}</div>
            <hr className={styles.divider} />

            <div className={styles.statsGroup}>
                <div className={styles.box}>
                    <div className={styles.statItem}>
                        <FaStar className={styles.iconStar} />
                        <div>
                            <div className={styles.mainText}>
                                {t('details.score') || 'Rating'} {Number.isFinite(statistics.rating.score) ? statistics.rating.score + '%' : 'N/A'}
                            </div>
                            <div className={styles.subText}>
                                {statistics.rating.prizes.map((prize, i) => (
                                    <div key={i}>{prize}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.box}>
                    <div className={styles.statItem}>
                        <MdShowChart className={styles.iconChart} />
                        <div>
                            <div className={styles.mainText}>
                                {t('details.popularity') || 'Popularity'} {Number.isFinite(statistics.popularity.score) ? statistics.popularity.score : 'N/A'}
                            </div>
                            <div className={styles.subText}>
                                {statistics.popularity.prizes.map((prize, i) => (
                                    <div key={i}>{prize}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.box}>
                    <div className={styles.statItem}>
                        <FaRegHeart className={styles.iconHeart} />
                        <div className={styles.mainText}>
                            {t('details.favorites') || 'Favorites'} {Number.isFinite(statistics.favorites.score) ? statistics.favorites.score : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
