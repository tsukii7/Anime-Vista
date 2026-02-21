import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'https://graphql.anilist.co';

export const fetchTotalCount = createAsyncThunk(
    'searchResults/fetchTotalCount',
    async (filters) => {
        const query = `
      query ($search: String, $genres: [String], $year: Int, $season: MediaSeason, $format: MediaFormat, $status: MediaStatus, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            hasNextPage
            currentPage
            lastPage
            total
          }
          media(search: $search, genre_in: $genres, seasonYear: $year, season: $season, format: $format, type: ANIME, status: $status, sort: [TRENDING_DESC, POPULARITY_DESC], genre_not_in: ["hentai"]) {

            id
          }
        }
      }
    `;

        const variablesBase = {
            search: filters.search || null,
            genres: filters.genres ? [filters.genres] : null,
            year: filters.year || null,
            season: filters.season || null,
            format: filters.format || null,
            status: filters.status || null,
        };

        // 删除空值字段
        Object.keys(variablesBase).forEach(
            (key) => variablesBase[key] === null && delete variablesBase[key]
        );

        let totalIds = [];
        let page = 1;
        const perPage = 50;
        let hasNextPage = true;

        while (hasNextPage) {
            const variables = { ...variablesBase, page, perPage };
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            const media = data?.data?.Page?.media ?? [];
            const pageInfo = data?.data?.Page?.pageInfo;

            totalIds = totalIds.concat(media.map((m) => m?.id));
            hasNextPage = pageInfo?.hasNextPage;
            page++;
            if (page > 3) break;
        }

        return totalIds.length;
    }
);
