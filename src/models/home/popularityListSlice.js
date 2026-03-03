// models/home/popularityListSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import anilistApi from '../../utils/anilistApi';

export const fetchPopularityList = createAsyncThunk(
    'popularity/fetchList',
    async (_, { signal }) => {
        const query = `
        query ($perPage: Int) {
            Page(page: 1, perPage: $perPage) {
                media(type: ANIME, sort: TRENDING_DESC, genre_not_in: ["hentai"]) {
                    id
                    title { english native romaji }
                    synonyms
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

        const perPage = 50;
        const response = await anilistApi.post('', {
            query,
            variables: { perPage }
        }, { signal });

        const pageData = response?.data?.data?.Page;
        if (!pageData || !Array.isArray(pageData.media) || !pageData.pageInfo) {
            throw new Error('AniList returned invalid payload');
        }

        // Clone and lightly shuffle the list to avoid looking identical
        // to the global "Trending" ranking while still keeping the same pool.
        const media = [...(pageData.media || [])];
        for (let i = media.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = media[i];
            media[i] = media[j];
            media[j] = tmp;
        }

        const totalPages = Math.max(1, Math.ceil(media.length / 10));

        return {
            media,
            totalPages
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
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchPopularityList.rejected, (state, action) => {
                if (action.error.name === 'AbortError' || action.meta.aborted) {
                    return;
                }
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { setPopularityPage } = popularityListSlice.actions;
export default popularityListSlice.reducer;
