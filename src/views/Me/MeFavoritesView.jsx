import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FavoriteCard from './components/FavoriteCard';
import styles from './MeFavouriteView.module.css';
import Pagination from '../../components/Pagination';
import { fetchAnimeDataBatch, setFavoritesPage, setFavoritesTotalPages } from '../../models/me/meSlice';
import LoadingIndicator from "../../components/LoadingIndicator.jsx";

const MeFavouriteView = ({favorites}) => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const { currentPage, totalPages, itemsPerPage } = useSelector((state) => state.me.favorites);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!favorites.length) {
        setAnimeList([]);
        dispatch(setFavoritesTotalPages(1));
        setTimeout(()=>{setLoading(false)}, 500);
        return;
      }

      try {
        const totalItems = favorites.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        dispatch(setFavoritesTotalPages(totalPages));

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageIds = favorites.slice(start, end);

        const result = await dispatch(fetchAnimeDataBatch(pageIds));
        const animeData = result.payload;
        const filtered = animeData.filter(item => item?.coverImage);

        setAnimeList(filtered);
        setError(false);
      } catch (err) {
        console.error('Error fetching favorite anime:', err);
        setError(true);
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
    return <div className={styles.errorMessage}><LoadingIndicator/></div>;
  }

  if (animeList.length === 0) {
    if (!loading &&!error)
      return <div className={styles.errorMessage}><LoadingIndicator isLoading={false} hasError={true} text={'No favorites added yet'}/></div>;
    return <div className={styles.errorMessage}><LoadingIndicator/></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.cardsGrid}>
        {animeList.map(anime => (
            anime &&
          <FavoriteCard
            key={anime?.id}
            id={anime?.id}
            image={anime?.coverImage.large}
            title={anime?.title.romaji}
            genres={anime?.genres}
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