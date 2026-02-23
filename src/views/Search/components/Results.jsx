import ResultCard from './ResultCard';
import styles from '../SearchView.module.css';
import LoadingIndicator from "../../../components/LoadingIndicator.jsx";
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

const Results = ({ results, loading, error }) => {
    const { t } = useLanguage();
    if (error) return (<div className={styles.statusMessage}>
        <LoadingIndicator isLoading={false} hasError={true} text={typeof error === 'string' ? error : t('common.error')} />
    </div>);

    return (
        <>
            {loading && (
                <div className={styles.statusMessage}>
                    <LoadingIndicator />
                </div>
            )}
            {!loading && results.length !== 0 && (
                <div className={styles.resultsGrid}>
                    {results.map((anime) => (
                        anime && <ResultCard key={anime?.id} anime={anime} />
                    ))}
                </div>
            )}
            {!loading && !error && results.length === 0 && (
                <div className={styles.statusMessage}>
                    <LoadingIndicator isLoading={false} hasError={true} text={t('search.noResults') || 'No Anime found.'} />
                </div>
            )}
        </>
    );
};

export default Results;