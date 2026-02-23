// src/views/Rank/components/RankingCard.jsx
import styles from '../RankView.module.css';
import { useNavigate } from "react-router";
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import { getDisplayTitle } from '../../../utils/animeUtils.js';

const RankingCard = ({ anime, rank, color }) => {
    const navigate = useNavigate();
    const { lang } = useLanguage();
    const { id, title, coverImage, averageScore } = anime || {};
    const translatedTitle = getDisplayTitle(anime, lang);

    function handleClick() {
        navigate(`/details/${id}`);
    }

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader} style={{ background: color }} />
            <div className={styles.cardText}>
                <div className={styles.cardRank} style={{ color }}>
                    {rank}
                </div>
                <div className={styles.cardTitle} onClick={handleClick}>{translatedTitle}</div>
            </div>
            <img className={styles.cardImage} src={coverImage?.large} alt={translatedTitle} onClick={handleClick} />
            <div className={styles.cardOverlay}></div>
            <div className={styles.cardScore}>{averageScore == null ? "N/A" : (averageScore / 10).toFixed(1)}</div>
        </div>
    );
};

export default RankingCard;
