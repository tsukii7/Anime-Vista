import { useState } from 'react';
import styles from './SearchView.module.css';
import Filters from './components/Filters';
import Tags from './components/Tags';
import Results from './components/Results';
import SearchInput from './components/SearchInput';
import Pagination from '../../components/Pagination';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';

const SearchView = ({ presenter }) => {
  const { t } = useLanguage();
  const [filtersExpanded, setFiltersExpanded] = useState(false);
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
      <div className={styles.searchRow}>
        <div className={styles.searchGroup}>
          <label>{t('nav.search') || 'Search'}</label>
          <SearchInput
            value={filters.search}
            onChange={(value) => onFilterChange('search', value)}
          />
        </div>
        <div className={styles.desktopFilters}>
          <Filters filters={filters} onFilterChange={onFilterChange} />
        </div>
        <button
          type="button"
          className={`${styles.filtersToggle} ${filtersExpanded ? styles.filtersToggleActive : ''}`}
          onClick={() => setFiltersExpanded((prev) => !prev)}
          aria-expanded={filtersExpanded}
          aria-label="Toggle filters"
        >
          {filtersExpanded ? <ExpandLessRoundedIcon /> : <TuneRoundedIcon />}
          <span>{t('search.filters') || 'Filters'}</span>
        </button>
      </div>

      <div className={`${styles.filtersSection} ${filtersExpanded ? styles.filtersSectionExpanded : ''}`}>
        <Filters filters={filters} onFilterChange={onFilterChange} />
      </div>

      <Tags
        filters={filters}
        onClear={onClearFilters}
        onRemoveFilter={onFilterChange}
      />

      <div className={styles.resultsWrapper}>
        <Results
          results={results}
          loading={loading}
          error={error}
        />
      </div>

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