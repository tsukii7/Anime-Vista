// src/components/layout/Pagination.jsx
import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    totalPages = Math.min(totalPages, 10); // Limit total pages to 10
    const handleClick = (page) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className={styles.paginationContainer}>
            <button
                className={styles.navButton}
                onClick={() => handleClick(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </button>

            <div className={styles.dotsContainer}>
                {Array.from({ length: totalPages }, (_, i) => (
                    <div
                        key={i}
                        className={`${styles.dot} ${currentPage === i + 1 ? styles.activeDot : ''}`}
                        onClick={() => handleClick(i + 1)}
                    />
                ))}
            </div>

            <button
                className={styles.navButton}
                onClick={() => handleClick(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;
