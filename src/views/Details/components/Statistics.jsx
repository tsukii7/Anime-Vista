import React from 'react';
import styles from './Statistics.module.css';
import {FaStar, FaRegHeart} from 'react-icons/fa';
import {MdShowChart} from 'react-icons/md';

const Statistics = ({statistics}) => {
    return (
        <div className={styles.container}>
            <div className={styles.title}>Statistics</div>
            <hr className={styles.divider}/>

            <div className={styles.statsGroup}>
                <div className={styles.box}>
                    <div className={styles.statItem}>
                        <FaStar className={styles.iconStar}/>
                        <div>
                            <div className={styles.mainText}>
                                Rating {Number.isFinite(statistics.rating.score) ? statistics.rating.score + '%' : 'N/A'}
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
                        <MdShowChart className={styles.iconChart}/>
                        <div>
                            <div className={styles.mainText}>
                                Popularity {Number.isFinite(statistics.popularity.score) ? statistics.popularity.score : 'N/A'}
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
                        <FaRegHeart className={styles.iconHeart}/>
                        <div className={styles.mainText}>
                            Favorites {Number.isFinite(statistics.favorites.score) ? statistics.favorites.score : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
