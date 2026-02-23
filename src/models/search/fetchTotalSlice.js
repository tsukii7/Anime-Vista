import { createAsyncThunk } from '@reduxjs/toolkit';
import anilistApi from '../../utils/anilistApi';

const TOTAL_CACHE_TTL_MS = 60 * 1000;
const totalCountCache = new Map();

export const fetchTotalCount = createAsyncThunk(
  'searchResults/fetchTotalCount',
  async (filters, { signal }) => {
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

    // Delete empty fields
    Object.keys(variablesBase).forEach(
      (key) => variablesBase[key] === null && delete variablesBase[key]
    );
    const cacheKey = JSON.stringify(variablesBase);
    const now = Date.now();
    const cached = totalCountCache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      return cached.total;
    }

    let total = 0;
    let page = 1;
    const perPage = 50;
    let hasNextPage = true;

    while (hasNextPage && !signal.aborted) {
      try {
        const variables = { ...variablesBase, page, perPage };
        const response = await anilistApi.post('', {
          query,
          variables,
        }, { signal });

        const pageData = response?.data?.data?.Page;
        const media = pageData?.media ?? [];
        total += media.length;
        hasNextPage = Boolean(pageData?.pageInfo?.hasNextPage);
        page++;
      } catch (error) {
        if (error.name === 'AbortError' || error.message === 'canceled') {
          return total;
        }
        throw error;
      }
    }

    totalCountCache.set(cacheKey, {
      total,
      expiresAt: now + TOTAL_CACHE_TTL_MS,
    });
    return total;
  }
);
