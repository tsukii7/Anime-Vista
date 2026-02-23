import { createSlice } from '@reduxjs/toolkit';

// Current year as default year option
const currentYear = new Date().getFullYear();

const initialState = {
  search: '',
  genres: '',
  season: '',
  year: currentYear, // Set default year to current year
  format: '',
  status: '',
  page: 1,
  perPage: 12
};

const filterSlice = createSlice({
  name: 'searchFilters',
  initialState,
  reducers: {
    updateFilter: (state, { payload }) => {
      state[payload.name] = payload.value;
      state.page = 1;
    },
    clearFilters: () => initialState,
    setPage: (state, action) => {
      state.page = action.payload;
    }
  }
});

export const { updateFilter, clearFilters, setPage } = filterSlice.actions;
export const selectSearchFilters = (state) => state.searchFilters;
export default filterSlice.reducer;