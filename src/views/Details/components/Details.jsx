import React from 'react';
import styles from './Details.module.css';

const Details = ({anime}) => {
    return (
        <div className={styles.banner} style={{ backgroundImage: `url(${anime?.bannerImage})` }}>
            <div className={styles.container}>
                <img className={styles.cover} src={anime?.coverImage.large} alt='title' />
                <div className={styles.meta}>
                    <h1 className={styles.title}>{anime?.title.native}</h1>
                    <p className={styles.score}>⭐ {anime?.averageScore ? (anime?.averageScore / 10).toFixed(1) : 'N/A'}</p>
                    <p className={styles.genres}>{anime?.genres?.join(' / ')}</p>
                    <p className={styles.info}>
                        {anime?.episodes} episodes · {anime?.duration} min / ep
                    </p>
                    <p className={styles.date}>
                        Start: {anime?.startDate?.year || 'Unknown'}-{anime?.startDate?.month}-{anime?.startDate?.day}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Details;
