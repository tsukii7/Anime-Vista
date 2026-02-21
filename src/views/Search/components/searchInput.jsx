import React from 'react';
import styles from '../SearchView.module.css';

const SearchInput = ({ value, onChange }) => {
  return (
    <input
      type="text"
      className={styles.searchInput}
      placeholder="Search for anime..."
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchInput;
