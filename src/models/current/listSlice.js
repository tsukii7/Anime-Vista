// src/models/list/listSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import anilistApi from '../../utils/anilistApi';

function getCurrentSeason() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  if (month >= 4 && month <= 6) return { year, season: 'SPRING' };
  if (month >= 7 && month <= 9) return { year, season: 'SUMMER' };
  if (month >= 10 && month <= 12) return { year, season: 'FALL' };
  return { year, season: 'WINTER' };
}

const FETCH_QUERY = `
  query($page: Int, $perPage: Int, $season: MediaSeason, $year: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        lastPage
      }
      media(
        season: $season,
        seasonYear: $year,
        type: ANIME,
        sort: [TRENDING_DESC, POPULARITY_DESC],
        genre_not_in: ["hentai"]
      ) {
        id
                    title { english native romaji }
                    synonyms
        coverImage {
          large
        }
        averageScore
        description(asHtml: false)
        episodes
        nextAiringEpisode {
          episode
        }
        genres
      }
    }
  }
`;

const COUNT_QUERY = `
  query ($page: Int, $perPage: Int, $season: MediaSeason, $year: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        hasNextPage
      }
      media(
        season: $season,
        seasonYear: $year,
        type: ANIME,
        sort: [TRENDING_DESC, POPULARITY_DESC],
        genre_not_in: ["hentai"]
      ) {
        id
      }
    }
  }
`;

// 获取当前季节动漫分页内容
export const fetchAnimeList = createAsyncThunk(
  'list/fetchAnimeList',
  async ({ page = 1, perPage = 20 } = {}, { signal }) => {
    const { year, season } = getCurrentSeason();
    const response = await anilistApi.post('', {
      query: FETCH_QUERY,
      variables: { page, perPage, year, season }
    }, { signal });

    const pageInfo = response.data.data.Page.pageInfo;
    const animeList = response.data.data.Page.media;

    return {
      seasonAnime: animeList,
      currentPage: pageInfo.currentPage,
    };
  }
);

// 获取当前季节动漫总数量（分页拉取 ID）
export const fetchSeasonTotalCount = createAsyncThunk(
  'list/fetchSeasonTotalCount',
  async (_, { signal }) => {
    const { year, season } = getCurrentSeason();
    const perPage = 50;
    let page = 1;
    let hasNextPage = true;
    let total = 0;

    while (hasNextPage && !signal.aborted) {
      try {
        const response = await anilistApi.post('', {
          query: COUNT_QUERY,
          variables: { page, perPage, year, season },
        }, { signal });

        const pageData = response.data.data.Page;
        total += pageData.media?.length;
        hasNextPage = pageData.pageInfo.hasNextPage;
        page++;
      } catch (error) {
        if (error.name === 'AbortError' || error.message === 'canceled') {
          return total;
        }
        throw error;
      }
    }

    return total;
  }
);

// Slice
const listSlice = createSlice({
  name: 'list',
  initialState: {
    seasonAnime: [],
    status: 'idle',
    error: null,
    currentPage: 1,
    totalPages: 1,
  },
  reducers: {
    setListPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimeList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAnimeList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.seasonAnime = action.payload.seasonAnime;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchAnimeList.rejected, (state, action) => {
        if (action.error.name === 'AbortError' || action.meta.aborted) {
          return;
        }
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchSeasonTotalCount.fulfilled, (state, action) => {
        const totalCount = action.payload;
        state.totalPages = Math.min(Math.ceil(totalCount / 20), 10); // 每页20项，最多10页
      });
  },
});

export const { setListPage } = listSlice.actions;
export default listSlice.reducer;
