import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTotalCount } from "./fetchTotalSlice.js";
import anilistApi from '../../utils/anilistApi';

export const fetchSearchResults = createAsyncThunk(
  'searchResults/fetch',
  async (filters, { signal }) => {
    // 构建GraphQL查询
    const query = `       query ($search: String, $genres: [String], $year: Int, $season: MediaSeason, $format: MediaFormat, $status: MediaStatus, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            hasNextPage
            currentPage
            lastPage
            total
          }         
          media(search: $search, genre_in: $genres, seasonYear: $year, season: $season, format: $format, type: ANIME, status: $status, sort: [TRENDING_DESC, POPULARITY_DESC], genre_not_in: ["hentai"]) {
            id
                    title { english native romaji }
                    synonyms
            genres
            season
            seasonYear
            status
            format
            episodes
            nextAiringEpisode {
              episode
            }
            averageScore
            startDate {
              year
              month
              day
            }
            coverImage {
              large
            }
            description(asHtml: false)
          }
        }
      }
    `;

    // 处理变量，确保格式正确
    const variables = {
      search: filters.search || null,
      genres: filters.genres ? [filters.genres] : null,
      year: filters.year || null,
      season: filters.season || null,
      format: filters.format || null,
      status: filters.status || null,
      page: filters.page || 1,
      perPage: filters.perPage || 12
    };

    // 移除空值，避免发送不必要的参数
    Object.keys(variables).forEach(key =>
      variables[key] === null && delete variables[key]
    );

    try {
      const response = await anilistApi.post('', {
        query,
        variables
      }, { signal });

      const data = response.data;

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      return {
        results: data.data.Page.media,
        currentPage: data.data.Page.pageInfo.currentPage,
        totalPages: data.data.Page.pageInfo.lastPage,
        total: data.data.Page.pageInfo.total,
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
);

const initialState = {
  results: [],
  loading: true,
  error: null,
  currentPage: 1,
  totalPages: 1,
  total: 0
};

const resultSlice = createSlice({
  name: 'searchResults',
  initialState,
  reducers: {
    clearResults: (state) => {
      state.results = [];
      state.currentPage = 1;
      state.totalPages = 1;
    },
    setSearchPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.results = payload.results;
        state.currentPage = payload.currentPage;
      })
      .addCase(fetchSearchResults.rejected, (state, { error, meta }) => {
        if (error.name === 'AbortError' || meta.aborted) {
          return;
        }
        state.loading = false;
        state.error = error.message;
      })
      .addCase(fetchTotalCount.fulfilled, (state, action) => {
        state.total = action.payload;
        state.totalPages = Math.ceil(action.payload / 12); // 基于每页12项计算
      })
      .addCase(fetchTotalCount.rejected, (state, action) => {
        console.error('Failed to get total count:', action.error.message);
      });
  }
});

export const { clearResults, setSearchPage } = resultSlice.actions;
export default resultSlice.reducer;