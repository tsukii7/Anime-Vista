import { createSlice } from '@reduxjs/toolkit';

// 当前年份作为默认年份选项
const currentYear = new Date().getFullYear();

const initialState = {
  search: '',
  genres: '',
  season: '',
  year: currentYear, // 设置默认年份为当前年份
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