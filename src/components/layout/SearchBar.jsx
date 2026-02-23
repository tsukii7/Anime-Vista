// src/components/layout/SearchBar.jsx
import { useState } from 'react';
import './SearchBar.css';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { clearFilters, updateFilter } from "../../models/search/filterSlice.js";
import { useLanguage } from '../../i18n/LanguageContext.jsx';

const SearchBar = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useLanguage();
    const placeholder = t('search.placeholder');

    const handleSearch = () => {
        if (!keyword.trim()) return;

        navigate('/search');
        dispatch(clearFilters());
        dispatch(updateFilter({ name: 'search', value: keyword.trim() }));
        setKeyword(''); // Clear the input field after search
    };

    return (
        <div className="search-bar">
            <input
                className="search-input"
                type="text"
                placeholder={placeholder}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                }}
            />
            <button
                className="search-button"
                onClick={handleSearch}
                disabled={!keyword.trim()}
                aria-label={t('nav.search')}
            >
                <SearchRoundedIcon className={'search-icon'} />
            </button>
        </div>
    );
};

export default SearchBar;
