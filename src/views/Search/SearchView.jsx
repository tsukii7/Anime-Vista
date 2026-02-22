import React from 'react';
import styles from './SearchView.module.css';
import Filters from './components/Filters';
import Tags from './components/Tags';
import Results from './components/Results';
import SearchInput from './components/SearchInput';
import Pagination from '../../components/Pagination';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

const SearchView = ({ presenter }) => {
  const { t } = useLanguage();
  const {
    filters,
    results,
    loading,
    error,
    currentPage,
    totalPages,
    onFilterChange,
    onClearFilters,
    onPageChange
  } = presenter;

  return (
    <div className={styles.container}>
      <div className={styles.searchHeader}>
        <div className={styles.filterGroup}>
          <label>{t('nav.search') || 'Search'}</label>
          <SearchInput
            value={filters.search}
            onChange={(value) => onFilterChange('search', value)}
          />
        </div>

        <Filters
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>

      <Tags
        filters={filters}
        onClear={onClearFilters}
        onRemoveFilter={onFilterChange}
      />

      <Results
        results={results}
        loading={loading}
        error={error}
      />

      {!loading && results.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default SearchView;