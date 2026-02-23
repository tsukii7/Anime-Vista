import styles from '../SearchView.module.css';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

const SearchInput = ({ value, onChange }) => {
  const { t } = useLanguage();
  return (
    <input
      type="text"
      className={styles.searchInput}
      placeholder={t('search.placeholder') || "Search for anime..."}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchInput;
