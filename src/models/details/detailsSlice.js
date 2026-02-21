import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const DETAILS_QUERY = `
query ($id: Int) {
    Media(id: $id, type: ANIME, genre_not_in: ["hentai"]) {
        id
        title {
            romaji
            english
            native
        }
        coverImage {
            large
        }
        bannerImage
        description(asHtml: false)
        nextAiringEpisode {
            airingAt
            episode
        }
        format
        episodes
        duration
        status
        startDate {
            year
            month
            day
        }
        endDate {
            year
            month
            day
        }
        season
        seasonYear
        averageScore
        meanScore
        popularity
        favourites
        studios {
            nodes {
                name
            }
        }
        source
        tags {
            name
            category
            rank
        }
        genres
        synonyms
        rankings {
            rank 
            type 
            year 
            season 
            context
        }
        characters(sort: ROLE) {
            edges {
                role
                node {
                    id
                    name {
                        native
                        full
                    }
                    image {
                        large
                    }
                }
                voiceActors {
                    name {
                        full
                    }
                }
            }
        }
        staff {
            edges {
                role
                node {
                    id
                    name {
                        full
                    }
                    image {
                        large
                    }
                }
            }
        }
        recommendations {
            nodes {
                mediaRecommendation {
                    id
                    title {
                        romaji
                    }
                    coverImage {
                        large
                    }
                    tags {
                        name
                        rank
                        category
                    }
                }
            }
        }
    }
}
`;

export const fetchAnimeDetails = createAsyncThunk(
    'details/fetchAnimeDetails',
    async (id) => {
        const response = await axios.post(
            'https://graphql.anilist.co',
            {
                query: DETAILS_QUERY,
                variables: { id: Number(id) },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );

        return response.data.data.Media;
    }
);

const detailsSlice = createSlice({
    name: 'details',
    initialState: {
        anime: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnimeDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAnimeDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.anime = action.payload;
            })
            .addCase(fetchAnimeDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default detailsSlice.reducer;
