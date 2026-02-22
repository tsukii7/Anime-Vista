import React from 'react';
import styles from '../SearchView.module.css';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

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

const Filters = ({ filters, onFilterChange }) => {
  const { t } = useLanguage();
  return (
    <div className={styles.searchHeader}>
      {/* Year 筛选 */}
      <div className={styles.filterGroup}>
        <label>{t('search.year') || 'Year'}</label>
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
          placeholder={t('search.year') || "Year"}
        />
      </div>

      {/* 其他下拉筛选 */}
      {Object.entries(FILTER_OPTIONS).map(([field, config]) => (
        <div key={field} className={styles.filterGroup}>
          <label>{t(`search.${field}`) || config.label}</label>
          <FormControl fullWidth variant="outlined" sx={{
            backgroundColor: '#FEF7FF',
            borderRadius: "8px",
            '& .MuiOutlinedInput-root': {
              borderRadius: "8px",
              '& fieldset': { borderColor: '#65558F', borderWidth: '2px' },
              '&:hover fieldset': { borderColor: '#65558F' },
              '&.Mui-focused fieldset': { borderColor: '#65558F', borderWidth: '2px', boxShadow: '0 0 0 4px rgba(101, 85, 143, 0.15)' }
            },
            '& .MuiSelect-select': { padding: '15px' }
          }}>
            <Select
              value={filters[field] || ''}
              displayEmpty
              renderValue={(selected) => {
                if (selected === '') return <em>{t('search.any') || 'Any'}</em>;
                const translated = field === 'genres'
                  ? (t(`search.genreList.${selected}`) !== `search.genreList.${selected}` ? t(`search.genreList.${selected}`) : formatOption(selected))
                  : (t(`search.options.${selected}`) !== `search.options.${selected}` ? t(`search.options.${selected}`) : formatOption(selected));
                return translated;
              }}
              onChange={(e) => onFilterChange(field, e.target.value)}
              IconComponent={(props) => (
                <svg {...props} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#65558F' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' style={{ right: '12px', position: 'absolute', pointerEvents: 'none', width: '20px', height: '20px' }}>
                  <polyline points='6 9 12 15 18 9'></polyline>
                </svg>
              )}
            >
              <MenuItem value=""><em>{t('search.any') || 'Any'}</em></MenuItem>
              {config.options.map(option => (
                <MenuItem key={option} value={option}>
                  {field === 'genres'
                    ? (t(`search.genreList.${option}`) !== `search.genreList.${option}` ? t(`search.genreList.${option}`) : formatOption(option))
                    : (t(`search.options.${option}`) !== `search.options.${option}` ? t(`search.options.${option}`) : formatOption(option))}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ))}
    </div>
  )
};

export default Filters;