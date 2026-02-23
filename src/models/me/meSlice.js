import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import anilistApi from '../../utils/anilistApi';

const query = `
    query ($ids: [Int], $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(id_in: $ids, type: ANIME, genre_not_in: ["hentai"]) {
          id
          title { english native romaji }
          synonyms
          coverImage { large }
          description
          averageScore
          episodes
          status
          genres
        }
      }
    }
`;
const inFlightBatchRequests = new Map();

export const fetchAnimeDataBatch = createAsyncThunk(
  'me/fetchAnimeDataBatch',
  async (ids, { signal }) => {
    const requestKey = Array.isArray(ids) ? ids.join(',') : '';
    if (inFlightBatchRequests.has(requestKey)) {
      try {
        return await inFlightBatchRequests.get(requestKey);
      } catch (inFlightError) {
        const inFlightCancelled = axios.isCancel(inFlightError) ||
          inFlightError?.name === 'AbortError' ||
          inFlightError?.message?.toLowerCase().includes('cancel');
        if (!inFlightCancelled || signal?.aborted) {
          throw inFlightError;
        }
      }
    }
    const requestPromise = (async () => {
      const variables = {
        ids: ids,
        page: 1,
        perPage: ids.length
      };
      const response = await anilistApi.post('', {
        query: query,
        variables: variables,
      }, { signal });

      const data = response.data;

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      return data?.data?.Page?.media || [];
    })();
    inFlightBatchRequests.set(requestKey, requestPromise);
    try {
      return await requestPromise;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw error;
      }
      console.error('[meSlice] fetchAnimeDataBatch failed:', error);
      throw error;
    } finally {
      inFlightBatchRequests.delete(requestKey);
    }
  }
);


const initialState = {
  favorites: {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
  },
  activities: {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 5,
  }
};

const meSlice = createSlice({
  name: 'me',
  initialState,
  reducers: {
    setFavoritesPage(state, action) {
      state.favorites.currentPage = action.payload;
    },
    setFavoritesTotalPages(state, action) {
      state.favorites.totalPages = action.payload;
    },
    setActivitiesPage(state, action) {
      state.activities.currentPage = action.payload;
    },
    setActivitiesTotalPages(state, action) {
      state.activities.totalPages = action.payload;
    }
  }
});

export const {
  setFavoritesPage,
  setFavoritesTotalPages,
  setActivitiesPage,
  setActivitiesTotalPages
} = meSlice.actions;

export default meSlice.reducer; 