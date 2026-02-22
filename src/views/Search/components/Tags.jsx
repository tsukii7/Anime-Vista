import React from 'react';
import styles from '../SearchView.module.css';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import TranslatedTag from '../../../components/TranslatedTag.jsx';

const formatTagValue = (key, value, t) => {
  if (key === 'season' || key === 'format' || key === 'status') {
    const uppercaseValue = value.toUpperCase();
    const translated = t(`search.options.${uppercaseValue}`);
    return translated !== `search.options.${uppercaseValue}` ? translated : value;
  }
  return value;
};

const Tags = ({ filters, onClear, onRemoveFilter }) => {
  const { t, lang } = useLanguage();
  const filterLabels = {
    search: t('nav.search') || 'Search',
    genres: t('search.genres') || 'Genre',
    season: t('search.season') || 'Season',
    format: t('search.format') || 'Format',
    status: t('search.status') || 'Status',
    year: t('search.year') || 'Year'
  };

  // 过滤出有效的筛选条件
  const activeFilters = Object.entries(filters)
    .filter(([key, value]) =>
      value && value !== '' && key !== 'page' && key !== 'perPage'
    );

  if (activeFilters.length === 0) return null;

  return (
    <div className={styles.tagsContainer}>
      {activeFilters.map(([key, value]) => (
        <div key={`${key}-${value}`} className={styles.tag}>
          <span>
            {filterLabels[key]}: {key === 'genres' ? <TranslatedTag tag={value} /> : formatTagValue(key, value, t)}
          </span>
          <button onClick={() => onRemoveFilter(key, '')}>×</button>
        </div>
      ))}
      {activeFilters.length > 0 && (
        <div
          className={styles.tag}
          style={{ backgroundColor: '#e0e0e0', color: '#333', cursor: 'pointer' }}
          onClick={onClear}
        >
          <span>{t('search.clear') || 'Clear All'}</span>
        </div>
      )}
    </div>
  );
};

export default Tags;