import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";

const query = `
    query ($ids: [Int]) {
      Page(perPage: 50) {
        media(id_in: $ids, type: ANIME) {
          id
          title { romaji }
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

export const fetchAnimeDataBatch = createAsyncThunk(
    'me/fetchAnimeDataBatch',
    async (ids) => {
      const response = await axios.post(
          'https://graphql.anilist.co',
          {
            query: query,
            variables: { ids: ids },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
      );

      return response.data.data.Page.media;
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