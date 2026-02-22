import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import anilistApi from '../../utils/anilistApi';

// GraphQL search
const RANKING_QUERY = `
  query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      media(sort: $sort, type: ANIME, genre_not_in: ["hentai"]) {
        id
                    title { english native romaji }
                    synonyms
        coverImage {
          large
        }
        averageScore
      }
    }
  }
`;
const apiURL = 'https://graphql.anilist.co';


// async action to fetch ranking list
export const fetchRankingList = createAsyncThunk(
    'ranking/fetchRankingList',
    async ({ sortType = 'TRENDING_DESC', page = 1 }, { signal }) => {
        const response = await anilistApi.post('', {
            query: RANKING_QUERY,
            variables: {
                page,
                perPage: 15,
                sort: [sortType],
            },
        }, { signal });

        const data = response.data;
        return {
            list: data.data.Page.media,
            page: page,
            totalPages: data.data.Page.pageInfo?.lastPage || 10,
        };
    }
);



// Redux Slice
const rankingSlice = createSlice({
    name: 'ranking',
    initialState: {
        list: [],
        status: 'idle',
        error: null,
        sortType: 'TRENDING_DESC',
        currentPage: 1,
        totalPages: 1,
    },
    reducers: {
        setSortType(state, action) {
            state.sortType = action.payload;
        },
        setPage(state, action) {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRankingList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRankingList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload.list;
                state.currentPage = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchRankingList.rejected, (state, action) => {
                if (action.error.name === 'AbortError' || action.meta.aborted) {
                    return;
                }
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setSortType, setPage } = rankingSlice.actions;
export default rankingSlice.reducer;