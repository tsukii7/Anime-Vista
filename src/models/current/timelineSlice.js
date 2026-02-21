import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export function getCurrentSeason() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    if (month >= 4 && month <= 6) return { year, season: 'Spring' };
    if (month >= 7 && month <= 9) return { year, season: 'Summer' };
    if (month >= 10 && month <= 12) return { year, season: 'Autumn' };
    return { year, season: 'Winter' };
}

export function findMaxDate(animeList) {
    let maxDate = new Date(0);
    for (const anime of animeList) {
        if (!anime?.airingSchedule || !anime?.airingSchedule.edges) continue;
        for (const edge of anime?.airingSchedule.edges) {
            const airingDate = new Date(edge.node.airingAt * 1000);
            if (airingDate > maxDate) {
                maxDate = airingDate;
            }
        }
    }
    return maxDate;
}

export const fetchAnimeTimeLine = createAsyncThunk(
    'timeline/fetchAnimeTimeLine',
    async ({page=1,perPage=50}={}) => {
        const {year, season} = getCurrentSeason();

        const query = `
        query($page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                }
                media(season: ${season.toUpperCase()}, seasonYear: ${year}, type: ANIME, genre_not_in: ["hentai"]) {
                    id
                    title {
                        romaji
                    }
                    coverImage {
                        large
                    }
                    airingSchedule {
                        edges {
                            node {
                                id
                                airingAt
                                episode
                                mediaId
                                media {
                                    title {
                                        romaji
                                    }
                                    episodes
                                }
                            }
                        }
                    }
                }
            }
        }
    `;
        let allAnime = [];

        try{
            for (let page = 1; page <= 2; page++) {
                const response = await axios.post('https://graphql.anilist.co', {
                query,
                variables: { page, perPage },
                });

                const media = response.data.data.Page.media;
                const hasNextPage = response.data.data.Page.pageInfo.hasNextPage;

                if (!hasNextPage) break;
                allAnime = allAnime?.concat(media);
            }
            const seasonAnimeList = allAnime
            const maxDate = findMaxDate(seasonAnimeList);
            return {
                seasonAnime: seasonAnimeList,
                groupedAnime: groupAnimeByDate(seasonAnimeList, maxDate),
                currentPage: page,
                totalPages: Math.ceil(seasonAnimeList.length / 15),
            };
        }catch (error) {
            console.error('Error fetching anime timeline:', error);
            throw error;
        }
    }
);

export function groupAnimeByDate(animeList, maxDate) {
    const today = new Date();
    const animeByDate = {};

    for (const anime of animeList) {
        if (!anime?.airingSchedule || !anime?.airingSchedule.edges) continue;
        for (const edge of anime?.airingSchedule.edges) {
            const airingDate = new Date(edge.node.airingAt * 1000);
            if (airingDate >= today && airingDate <= maxDate) {
                const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const dateKey = airingDate.toLocaleDateString('en-CA', { timeZone });

                if (!animeByDate[dateKey]) {
                    animeByDate[dateKey] = {
                        date: dateKey,
                        weekday: airingDate.toLocaleDateString('en-US', {
                            weekday: 'short',
                            // display local time zone
                            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                        }),
                        animes: []
                    };
                }

                animeByDate[dateKey].animes.push({
                    title: anime?.title.romaji,
                    coverImage: anime?.coverImage.large,
                    episode: edge.node.episode,
                    id: anime?.id,
                    airingAt: airingDate.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                    }),
                    airingAtValue: airingDate.getTime(),
                });
            }
        }
    }

        Object.values(animeByDate).forEach(day => {
        day.animes.sort((a, b) => a.airingAtValue - b.airingAtValue);
    });

    return Object.values(animeByDate).sort((a, b) => a.date.localeCompare(b.date));
}

const timelineSlice = createSlice({
    name:"timeline",
    initialState:{
        seasonAnime: [],
        groupedAnime: [],
        status: 'idle',
        error: null,
        currentPage: 1,
        totalPages: 1,
    },
    reducers: {
        setTimelinePage: (state, action) => {
            state.currentPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnimeTimeLine.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAnimeTimeLine.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.seasonAnime = action.payload.seasonAnime;
                state.groupedAnime = action.payload.groupedAnime;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchAnimeTimeLine.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
})

export const { setTimelinePage } = timelineSlice.actions;
export default timelineSlice.reducer;
