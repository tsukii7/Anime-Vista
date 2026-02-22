import React from 'react';
import { useNavigate } from 'react-router';
import styles from './ActivityCard.module.css';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { likeComment, unlikeComment } from '../../../firebase/db';
import { getCurrentUser } from '../../../firebase/auth';
import defaultAvatar from '../../../assets/default-avatar.png'
import { getDisplayTitle } from '../../../utils/animeUtils';
import { useLanguage } from '../../../i18n/LanguageContext';

const ActivityCard = ({
  userAvatar,
  username,
  date,
  commentText,
  anime,
  likeCount,
  animeId,
  id,
  hasLiked
}) => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const animeTitle = getDisplayTitle(anime, lang);
  const animeImage = anime?.coverImage?.large;
  const animeScore = (anime?.averageScore / 10).toFixed(1);

  const handleAnimeClick = () => {
    navigate(`/details/${animeId}`);
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation(); // 防止事件冒泡
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
      if (hasLiked) {
        await unlikeComment(currentUser.userId, id);
      } else {
        await likeComment(currentUser.userId, id);
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.cardContainer}>
        <img className={styles.userAvatar} src={userAvatar ? userAvatar : defaultAvatar} alt="User avatar" />
        <div className={styles.contentContainer}>
          <div className={styles.userInfoSection}>
            <div className={styles.headerSection}>
              <div className={styles.usernameText}>{username}</div>
            </div>
            <div className={styles.dateText}>{date}</div>
          </div>
          <div className={styles.commentText}>{commentText}</div>
          <div
            className={styles.animeInfoContainer}
          >
            <img className={styles.animeImage} src={animeImage} alt={animeTitle} onClick={handleAnimeClick} />
            <div className={styles.animeDetails}>
              <div className={styles.animeTitle} onClick={handleAnimeClick}>{animeTitle}</div>
              <div className={styles.animeScore}>Score {animeScore}</div>
            </div>
          </div>
          <div className={styles.interactionContainer}>
            <div className={styles.likeSection}>
              <button className={styles.likeBtn} onClick={handleLikeClick}>
                {hasLiked ? (
                  <ThumbUpIcon className={styles.liked} sx={{ fontSize: 16 }} />
                ) : (
                  <ThumbUpOutlinedIcon className={styles.unliked} sx={{ fontSize: 16 }} />
                )}
                <span className={styles.likeCount}>{likeCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;