import React from 'react';
import styles from '../SearchView.module.css';

const FILTER_OPTIONS = {
  genres: {
    label: 'Genres',
    options: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi', 'Slice of Life']
  },
  season: {
    label: 'Season',
    options: ['WINTER', 'SPRING', 'SUMMER', 'FALL']
  },
  format: {
    label: 'Format',
    options: ['TV', 'TV_SHORT', 'MOVIE', 'SPECIAL', 'OVA', 'ONA', 'MUSIC']
  },
  status: {
    label: 'Status',
    options: ['FINISHED', 'RELEASING', 'NOT_YET_RELEASED', 'CANCELLED', 'HIATUS']
  }
};

const formatOption = (option) => 
  option.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());

const Filters = ({ filters, onFilterChange }) => (
  <div className={styles.searchHeader}>
    {/* Year 筛选 */}
    <div className={styles.filterGroup}>
      <label>Year</label>
      <input
        type="number"
        className={styles.yearInput}
        value={filters.year || ''}
        onChange={(e) => {
          const value = e.target.value;
          // 限制最大4位数
          if (value === '' || (value.length <= 4 && !isNaN(value))) {
            onFilterChange('year', value === '' ? '' : parseInt(value));
          }
        }}
        placeholder="Year"
      />
    </div>
    
    {/* 其他下拉筛选 */}
    {Object.entries(FILTER_OPTIONS).map(([field, config]) => (
      <div key={field} className={styles.filterGroup}>
        <label>{config.label}</label>
        <select
          value={filters[field] || ''}
          onChange={(e) => onFilterChange(field, e.target.value)}
        >
          <option value="">Any</option>
          {config.options.map(option => (
            <option key={option} value={option}>
              {formatOption(option)}
            </option>
          ))}
        </select>
      </div>
    ))}
  </div>
);

export default Filters;