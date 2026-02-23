import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateFilter,
  clearFilters,
  setPage,
  selectSearchFilters
} from '../models/search/filterSlice';

import {
  fetchSearchResults,
  clearResults,
  setSearchPage
} from '../models/search/resultSlice';

import SearchView from '../views/Search/SearchView';
import { fetchTotalCount } from "../models/search/fetchTotalSlice.js";

const SearchPresenter = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectSearchFilters);
  const { results, loading, error, currentPage, totalPages } = useSelector((state) => state.searchResults);

  const previousFiltersRef = React.useRef(filters);
  const hasLoadedOnce = React.useRef(false);

  const handleFilterChange = (name, value) => {
    dispatch(updateFilter({ name, value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(clearResults());
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    dispatch(setSearchPage(newPage));
  };

  const fetchPromiseRef = React.useRef(null);
  const totalPromiseRef = React.useRef(null);
  const abortThunkPromise = (promise) => {
    if (promise && typeof promise.abort === 'function') {
      promise.abort();
    }
  };

  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const prev = previousFiltersRef.current;
      const isInitial = !hasLoadedOnce.current;

      // Filters that affect the TOTAL number of results
      const totalAffectingKeys = ['search', 'genres', 'season', 'year', 'format', 'status'];
      const totalFiltersChanged = totalAffectingKeys.some(key => filters[key] !== prev[key]);

      // Page changing doesn't affect the total count but requires new results
      const pageChanged = filters.page !== prev.page;

      // 1. Handle Total Count Fetching
      if (isInitial || totalFiltersChanged) {
        if (totalFiltersChanged) {
          dispatch(clearResults());
          dispatch(setSearchPage(1));
        }

        abortThunkPromise(totalPromiseRef.current);
        const totalFilters = totalFiltersChanged ? { ...filters, page: 1 } : filters;
        totalPromiseRef.current = dispatch(fetchTotalCount(totalFilters));
      }

      // 2. Handle Search Results Fetching
      if (isInitial || totalFiltersChanged || pageChanged) {
        abortThunkPromise(fetchPromiseRef.current);
        const nextFilters = totalFiltersChanged ? { ...filters, page: 1 } : filters;
        fetchPromiseRef.current = dispatch(fetchSearchResults(nextFilters));
      }

      hasLoadedOnce.current = true;
      previousFiltersRef.current = filters;
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
      abortThunkPromise(fetchPromiseRef.current);
      abortThunkPromise(totalPromiseRef.current);
    };
  }, [filters, dispatch]);

  const presenter = {
    filters,
    results: results || [],
    loading,
    error,
    currentPage,
    totalPages,
    onFilterChange: handleFilterChange,
    onClearFilters: handleClearFilters,
    onPageChange: handlePageChange
  };

  return <SearchView presenter={presenter} />;
};

export default SearchPresenter;
