import { createAsyncThunk } from '@reduxjs/toolkit';
import anilistApi from '../../utils/anilistApi';

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

    // 删除空值字段
    Object.keys(variablesBase).forEach(
      (key) => variablesBase[key] === null && delete variablesBase[key]
    );

    let totalIds = [];
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

        const data = response.data;
        const media = data?.data?.Page?.media ?? [];
        const pageInfo = data?.data?.Page?.pageInfo;

        totalIds = totalIds.concat(media.map((m) => m?.id));
        hasNextPage = pageInfo?.hasNextPage;
        page++;
        if (page > 3) break;
      } catch (error) {
        if (error.name === 'AbortError' || error.message === 'canceled') {
          return totalIds.length;
        }
        throw error;
      }
    }

    return totalIds.length;
  }
);
