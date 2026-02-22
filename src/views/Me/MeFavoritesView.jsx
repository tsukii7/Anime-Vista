import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FavoriteCard from './components/FavoriteCard';
import styles from './MeFavouriteView.module.css';
import Pagination from '../../components/Pagination';
import { fetchAnimeDataBatch, setFavoritesPage, setFavoritesTotalPages } from '../../models/me/meSlice';
import LoadingIndicator from "../../components/LoadingIndicator.jsx";
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { getDisplayTitle } from '../../utils/animeUtils.js';

const MeFavouriteView = ({ favorites }) => {
  const { lang } = useLanguage();
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { currentPage, totalPages, itemsPerPage } = useSelector((state) => state.me.favorites);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!favorites.length) {
        setAnimeList([]);
        dispatch(setFavoritesTotalPages(1));
        setTimeout(() => { setLoading(false) }, 500);
        return;
      }

      try {
        const totalItems = favorites.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        dispatch(setFavoritesTotalPages(totalPages));

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // Reverse favorites to show newest first!
        const reversedFavorites = [...favorites].reverse();
        const pageIds = reversedFavorites.slice(start, end);

        const result = await dispatch(fetchAnimeDataBatch(pageIds));

        if (result.error) {
          setError(result.error.message);
          return;
        }

        const animeData = result.payload;

        // Ensure strictly sorted based on the order of reversedFavorites!
        const filtered = animeData
          .filter(item => item?.coverImage)
          .sort((a, b) => {
            const indexA = pageIds.indexOf(a.id);
            const indexB = pageIds.indexOf(b.id);
            return indexA - indexB; // Match the order of pageIds
          });

        setAnimeList(filtered);
        setError(null);
      } catch (err) {
        console.error('Error fetching favorite anime:', err);
        setError(err.message || 'Failed to fetch favorites');
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [favorites, currentPage, itemsPerPage, dispatch]);

  const handlePageChange = (newPage) => {
    dispatch(setFavoritesPage(newPage));
  };

  if (loading) {
    return <div className={styles.errorMessage}><LoadingIndicator /></div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>
      <LoadingIndicator isLoading={false} hasError={true} text={error} />
    </div>;
  }

  if (animeList.length === 0) {
    return <div className={styles.errorMessage}><LoadingIndicator isLoading={false} hasError={true} text={'No favorites added yet'} /></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.cardsGrid}>
        {animeList.map(anime => (
          anime &&
          <FavoriteCard
            key={anime?.id}
            anime={anime}
          />
        ))}
      </div>
      <div className={styles.paginationWrapper}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default MeFavouriteView;