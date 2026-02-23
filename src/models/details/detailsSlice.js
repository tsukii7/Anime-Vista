import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import anilistApi from '../../utils/anilistApi';

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
                        english
                        native
                    }
                    synonyms
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

const LOCALIZED_TITLES_QUERY = `
query ($ids: [Int]) {
    Page(page: 1, perPage: 50) {
        media(id_in: $ids, type: ANIME) {
            id
            title {
                romaji
                english
                native
            }
            synonyms
        }
    }
}
`;
const inFlightDetailsRequests = new Map();

export const fetchAnimeDetails = createAsyncThunk(
    'details/fetchAnimeDetails',
    async (id, { signal }) => {
        const animeId = Number(id);
        if (inFlightDetailsRequests.has(animeId)) {
            try {
                return await inFlightDetailsRequests.get(animeId);
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
        // Step 1: Fetch main anime details
        const response = await anilistApi.post('', {
            query: DETAILS_QUERY,
            variables: { id: animeId },
        }, { signal });

        const anime = response.data.data.Media;

        // Step 2: Perform secondary fetch for recommendation titles to trigger proxy localization
        const recommendationIds = anime?.recommendations?.nodes
            ?.map(node => node.mediaRecommendation?.id)
            .filter(Boolean) || [];

        if (recommendationIds.length > 0 && !signal.aborted) {
            try {
                const localizedResponse = await anilistApi.post('', {
                    query: LOCALIZED_TITLES_QUERY,
                    variables: { ids: recommendationIds },
                }, { signal });

                const localizedMediaMap = {};
                localizedResponse.data.data.Page.media.forEach(m => {
                    localizedMediaMap[m.id] = m;
                });

                // Merge localized titles/synonyms back into the recommendation nodes
                anime.recommendations.nodes = anime.recommendations.nodes.map(node => {
                    const media = node.mediaRecommendation;
                    if (media && localizedMediaMap[media.id]) {
                        return {
                            ...node,
                            mediaRecommendation: {
                                ...media,
                                title: localizedMediaMap[media.id].title,
                                synonyms: localizedMediaMap[media.id].synonyms
                            }
                        };
                    }
                    return node;
                });
            } catch (error) {
                const isCancelled = error?.name === 'AbortError' || error?.message?.toLowerCase().includes('cancel');
                if (!isCancelled) {
                    console.error('[DetailsSlice] Failed to fetch localized recommendation titles:', error);
                }
            }
        }

        return anime;
        })();
        inFlightDetailsRequests.set(animeId, requestPromise);
        try {
            return await requestPromise;
        } finally {
            inFlightDetailsRequests.delete(animeId);
        }
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
                const isCancelled = action.error.name === 'AbortError' ||
                    action.error.name === 'CanceledError' ||
                    action.meta.aborted ||
                    action.error.message?.toLowerCase().includes('cancel');
                if (isCancelled) {
                    return;
                }
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default detailsSlice.reducer;
