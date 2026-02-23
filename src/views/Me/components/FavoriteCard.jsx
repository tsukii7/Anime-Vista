import styles from './favoriteCard.module.css';
import FavoriteBtn from '../../../components/FavoriteBtn';
import { useNavigate } from 'react-router';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import { getDisplayTitle } from '../../../utils/animeUtils.js';

const FavoriteCard = ({ anime }) => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { id, coverImage, genres } = anime || {};
  const title = getDisplayTitle(anime, lang);
  const image = coverImage?.large;

  const handleCardClick = () => {
    navigate(`/details/${id}`);
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.imageWrapper}>
        <img
          className={styles.coverImage}
          src={image}
          alt={title}
          onClick={handleCardClick}
        />
        <div className={styles.favoriteWrapper} onClick={e => e.stopPropagation()}>
          <FavoriteBtn isFavorite={true} id={id} />
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <h3 className={styles.titleText} onClick={handleCardClick}>{title}</h3>
        {genres && genres.length > 0 && (
          <div className={styles.genres}>
            {genres.slice(0, 2).map((genre, index) => (
              <span key={index} className={styles.genre}>
                {t(`search.genreList.${genre}`) !== `search.genreList.${genre}` ? t(`search.genreList.${genre}`) : genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteCard;
