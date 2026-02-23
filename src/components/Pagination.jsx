// src/components/layout/Pagination.jsx
import styles from './Pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    totalPages = Math.min(totalPages, 10); // Limit total pages to 10
    const handleClick = (page) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <nav className={styles.paginationContainer} aria-label="Pagination">
            <button
                className={styles.navButton}
                onClick={() => handleClick(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                &lt;
            </button>

            <div className={styles.dotsContainer}>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        type="button"
                        key={i}
                        className={`${styles.dot} ${currentPage === i + 1 ? styles.activeDot : ''}`}
                        onClick={() => handleClick(i + 1)}
                        aria-label={`Page ${i + 1}`}
                        aria-current={currentPage === i + 1 ? 'page' : undefined}
                    />
                ))}
            </div>

            <button
                className={styles.navButton}
                onClick={() => handleClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                &gt;
            </button>
        </nav>
    );
};

export default Pagination;
