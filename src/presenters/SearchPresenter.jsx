import React, { useEffect, useRef } from 'react';
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

  const previousFiltersRef = useRef(filters);
  const hasLoadedOnce = useRef(false);

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

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const prev = previousFiltersRef.current;

      const filtersChanged =
          JSON.stringify({ ...filters, page: 0 }) !== JSON.stringify({ ...prev, page: 0 });

      if (!hasLoadedOnce.current || filtersChanged) {
        dispatch(clearResults());
        dispatch(setSearchPage(1));
        dispatch(fetchTotalCount(filters));
        hasLoadedOnce.current = true;
        previousFiltersRef.current = filters;
      }

      dispatch(fetchSearchResults(filters));
    }, 500);

    return () => clearTimeout(debounceTimer);
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
