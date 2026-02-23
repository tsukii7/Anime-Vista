import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FavoriteCard from './components/FavoriteCard';
import styles from './MeFavouriteView.module.css';
import Pagination from '../../components/Pagination';
import { fetchAnimeDataBatch, setFavoritesPage } from '../../models/me/meSlice';
import LoadingIndicator from "../../components/LoadingIndicator.jsx";
import { useLanguage } from '../../i18n/LanguageContext.jsx';

const MeFavouriteView = ({ favorites }) => {
  const { t } = useLanguage();
  const [animeList, setAnimeList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [reloadNonce, setReloadNonce] = React.useState(0);
  const dispatch = useDispatch();

  // Page and items per page from Redux
  const { currentPage, itemsPerPage } = useSelector((state) => state.me.favorites);

  // Computed total pages (Local state to avoid triggering Redux loops)
  const [totalPages, setTotalPages] = React.useState(1);
  const pageCacheRef = React.useRef(new Map());
  const favoritesSignature = React.useMemo(
    () => (Array.isArray(favorites) ? favorites.join(',') : ''),
    [favorites]
  );

  React.useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const loadFavorites = async () => {
      const favArray = Array.isArray(favorites) ? favorites : [];

      if (favArray.length === 0) {
        if (isMounted) {
          setAnimeList([]);
          setTotalPages(1);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const totalItems = favArray.length;
        const totalPagesCalc = Math.ceil(totalItems / itemsPerPage);
        setTotalPages(totalPagesCalc);

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // Display newest first
        const reversedFavorites = [...favArray].reverse();
        const pageIds = reversedFavorites.slice(start, end)
          .map(id => Number(id))
          .filter(id => !isNaN(id) && id > 0);
        const pageKey = pageIds.join(',');

        if (pageIds.length === 0) {
          if (isMounted) {
            setAnimeList([]);
            setLoading(false);
          }
          return;
        }
        if (pageCacheRef.current.has(pageKey)) {
          if (isMounted) {
            setAnimeList(pageCacheRef.current.get(pageKey));
            setLoading(false);
          }
          return;
        }

        // Fetch batch details from AniList
        const result = await dispatch(fetchAnimeDataBatch(pageIds, { signal: controller.signal }));

        if (!isMounted) return;

        if (result.error) {
          // Detect cancellation (AbortError or specific canceled message)
          const isCancelled = result.error.name === 'AbortError' ||
            result.error.message?.toLowerCase().includes('cancel') ||
            result.meta?.aborted;

          if (isCancelled) return;

          setError(result.error.message || t('me.favoritesLoadFailed'));
          return;
        }

        const animeData = result.payload;
        if (!Array.isArray(animeData)) {
          setError(t('me.invalidFavoritesData'));
          return;
        }

        // Maintain the order of IDs as they were in the favorites list
        const filtered = animeData
          .filter(item => item?.coverImage)
          .sort((a, b) => {
            const indexA = pageIds.indexOf(Number(a.id));
            const indexB = pageIds.indexOf(Number(b.id));
            return indexA - indexB;
          });

        pageCacheRef.current.set(pageKey, filtered);
        setAnimeList(filtered);
      } catch (err) {
        if (isMounted) {
          const isCancelled = err.name === 'AbortError' ||
            err.message?.toLowerCase().includes('cancel');
          if (!isCancelled) {
            console.error('Error in MeFavoritesView:', err);
            setError(err.message || t('me.favoritesLoadFailed'));
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadFavorites();

    return () => {
      isMounted = false;
      controller.abort();
    };
    // CRITICAL: Do NOT add 'loading' or 'animeList' to dependencies to avoid infinite loops
  }, [favoritesSignature, currentPage, itemsPerPage, dispatch, reloadNonce]);

  const handlePageChange = (newPage) => {
    dispatch(setFavoritesPage(newPage));
  };

  if (loading) {
    return <div className={styles.errorMessage}><LoadingIndicator /></div>;
  }

  if (error) {
    return (
      <div className={styles.errorMessage}>
        <LoadingIndicator isLoading={false} hasError={true} text={error} />
        <button
          onClick={() => { setLoading(true); setError(null); setReloadNonce(prev => prev + 1); }}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid #A6A1B8',
            background: 'none',
            cursor: 'pointer',
            color: '#A6A1B8'
          }}
        >
          {t('me.retryLoading')}
        </button>
      </div>
    );
  }

  if (animeList.length === 0) {
    const rawCount = Array.isArray(favorites) ? favorites.length : 0;
    const msg = rawCount > 0
      ? `${t('me.favoritesFoundPrefix')} ${rawCount} ${t('me.favoritesFoundSuffix')}`
      : t('me.noFavorites') || 'No favorites added yet';

    return (
      <div className={styles.errorMessage}>
        <LoadingIndicator isLoading={false} hasError={rawCount > 0} text={msg} />
        {rawCount > 0 && (
          <button
            onClick={() => { setLoading(true); setError(null); setReloadNonce(prev => prev + 1); }}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid #A6A1B8',
              background: 'none',
              cursor: 'pointer',
              color: '#A6A1B8'
            }}
          >
            {t('me.retryLoading')}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.cardsGrid}>
        {animeList.map(anime => (
          anime &&
          <FavoriteCard
            key={anime.id}
            anime={anime}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default MeFavouriteView;