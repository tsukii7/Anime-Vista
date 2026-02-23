import * as React from 'react';
import Conditions from './components/Conditions';
import Rankings from './components/Rankings';
import Pagination from '../../components/Pagination.jsx';
import { useSelector } from 'react-redux';
import styles from './RankView.module.css';

const RankView = ({ onPageChange }) => {
    const { status, currentPage, totalPages } = useSelector((state) => state.ranking);

    return (
        <div className={styles.rankContainer}>
            <Conditions />
            <div className={styles.rankBody}>
                <Rankings />
                {status === 'succeeded' && (
                    <div className={styles.rankPagination}>
                        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default RankView;
