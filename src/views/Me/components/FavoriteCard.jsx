import React from 'react';
import styles from './favoriteCard.module.css';
import FavoriteBtn from '../../../components/FavoriteBtn';
import { useNavigate } from 'react-router';

const FavoriteCard = ({ id, image, title, genres }) => {
  const navigate = useNavigate();

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
        <h3 className={styles.titleText}  onClick={handleCardClick}>{title}</h3>
        {genres && genres.length > 0 && (
          <div className={styles.genres}>
            {genres.slice(0, 2).map((genre, index) => (
              <span key={index} className={styles.genre}>{genre}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteCard;
