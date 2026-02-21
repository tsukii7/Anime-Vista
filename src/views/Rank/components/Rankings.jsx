// src/views/Rank/components/Rankings.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import RankingCard from './RankingCard.jsx';
import styles from '../RankView.module.css';
import LoadingIndicator from "../../../components/LoadingIndicator.jsx";

const Rankings = () => {
    const { list, status, error, currentPage } = useSelector((state) => state.ranking);
    const perPage = 15;

    if (status === 'loading') return <LoadingIndicator />;
    if (status === 'failed') return <LoadingIndicator isLoading={false} hasError={true}/>;

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
                        id={anime?.id}
                        rank={globalRank}
                        title={anime?.title?.romaji ?? 'No Title'}
                        image={anime?.coverImage?.large ?? ''}
                        score={anime?.averageScore ?? 'N/A'}
                        color={getHeaderColor(globalRank)}
                    />
                );
            })}
        </div>
    );
};

export default Rankings;
