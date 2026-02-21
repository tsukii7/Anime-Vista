// src/views/Rank/components/RankingCard.jsx
import React from 'react';
import styles from '../RankView.module.css';
import {useNavigate} from "react-router";

const RankingCard = ({id, rank, title, image, score, color }) => {
    const navigate = useNavigate();
    const handleAnimeClick = () => {
        navigate(`/details/${id}`);
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader} style={{ background: color }} />
            <div className={styles.cardText}>
                <div className={styles.cardRank} style={{ color }}>
                    {rank}
                </div>
                <div className={styles.cardTitle} onClick={handleAnimeClick}>{title}</div>
            </div>
            <img className={styles.cardImage} src={image} alt={title} onClick={handleAnimeClick}/>
            <div className={styles.cardOverlay}></div>
            <div className={styles.cardScore}>{score=="N/A"?"N/A":(score / 10).toFixed(1)}</div>
        </div>
    );
};

export default RankingCard;
