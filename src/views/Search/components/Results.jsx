import React from 'react';
import ResultCard from './ResultCard';
import styles from '../SearchView.module.css';
import LoadingIndicator from "../../../components/LoadingIndicator.jsx";

const Results = ({ results, loading, error }) => {
  if (error) return (<div className={styles.statusMessage}>
      <LoadingIndicator isLoading={false} hasError={true}/>
    </div>);

    return (
        <>
            {loading && (
                <div className={styles.statusMessage}>
                  <LoadingIndicator/>
                </div>
            )}
            {!loading && results.length !== 0 && (
                <div className={styles.resultsGrid}>
                    {results.map((anime) => (
                        anime && <ResultCard key={anime?.id} anime={anime}/>
                    ))}
                </div>
            )}
            {!loading && !error && results.length === 0 && (
                <div className={styles.statusMessage}>
                    <LoadingIndicator isLoading={false} hasError={true} text={'No Anime found.'}/>
                </div>
            )}
        </>
    );
};

export default Results;