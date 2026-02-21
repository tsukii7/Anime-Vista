// models/home/popularityListSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPopularityList = createAsyncThunk(
    'popularity/fetchList',
    async ({ page = 1 } = {}) => {
        const query = `
        query ($page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
                media(type: ANIME, sort: TRENDING_DESC, genre_not_in: ["hentai"]) {
                    id
                    title { romaji }
                    coverImage { large }
                    startDate { year month day }
                    description
                    genres
                    averageScore
                }
                pageInfo {
                    total
                    lastPage
                }
            }
        }`;

        const apiURL = 'https://graphql.anilist.co';

        const response = await axios.post(apiURL, {
            query,
            variables: { page, perPage: 10 }
        }, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });

        return {
            media: response.data.data.Page.media,
            page,
            totalPages: response.data.data.Page.pageInfo.lastPage
        };
    }
);

const popularityListSlice = createSlice({
    name: 'popularityList',
    initialState: {
        list: [],
        status: 'idle',
        error: null,
        currentPage: 1,
        totalPages: 1
    },
    reducers: {
        setPopularityPage(state, action) {
            state.currentPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPopularityList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPopularityList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload.media;
                state.currentPage = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchPopularityList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { setPopularityPage } = popularityListSlice.actions;
export default popularityListSlice.reducer;
