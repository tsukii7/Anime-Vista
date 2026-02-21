import React from 'react';
import styles from '../SearchView.module.css';

const filterLabels = {
  search: 'Search',
  genres: 'Genre',
  season: 'Season',
  format: 'Format',
  status: 'Status',
  year: 'Year'
};

const formatTagValue = (key, value) => {
  if (key === 'season') {
    return value.charAt(0) + value.slice(1).toLowerCase();
  }
  return value;
};

const Tags = ({ filters, onClear, onRemoveFilter }) => {
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
          <span>{filterLabels[key]}: {formatTagValue(key, value)}</span>
          <button onClick={() => onRemoveFilter(key, '')}>×</button>
        </div>
      ))}
      {activeFilters.length > 0 && (
        <div 
          className={styles.tag}
          style={{ backgroundColor: '#e0e0e0', color: '#333', cursor: 'pointer' }}
          onClick={onClear}
        >
          <span>Clear All</span>
        </div>
      )}
    </div>
  );
};

export default Tags;