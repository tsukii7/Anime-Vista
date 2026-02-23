// src/views/Home/components/PopularityListItem.jsx
import { useState, useEffect } from 'react';
import styles from '../HomeView.module.css';
import { useNavigate } from "react-router";
import FavoriteBtn from "../../../components/FavoriteBtn.jsx";
import { useUserFavorites } from "../../../firebase/db.js";
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import { translateToChinese } from '../../../utils/translateText.js';
import { getDisplayTitle } from '../../../utils/animeUtils.js';

const PopularityListItem = ({ anime }) => {
    const navigate = useNavigate();
    const { lang, t } = useLanguage();
    const favorites = useUserFavorites();

    const displayTitle = getDisplayTitle(anime, lang);
    const ratingValue = Math.round((anime?.averageScore || 0) / 20);
    const stars = Array.from({ length: ratingValue }, (_, i) => (
        <div key={i} className={styles.star} />
    ));

    const genre = anime?.genres?.[0];
    const localizedGenre = t(`search.genreList.${genre}`) !== `search.genreList.${genre}` ? t(`search.genreList.${genre}`) : genre;
    const category = `${localizedGenre || t('common.unknown')} • ${anime?.startDate?.year}-${anime?.startDate?.month}-${anime?.startDate?.day}`;

    const originalDesc = (anime?.description?.length > 1000 ? anime?.description.slice(0, 1000) + '...' : anime?.description) || 'N/A';
    const [translatedDesc, setTranslatedDesc] = useState(originalDesc);

    useEffect(() => {
        if (lang === 'zh' && originalDesc !== 'N/A') {
            translateToChinese(originalDesc).then(setTranslatedDesc);
        } else {
            setTranslatedDesc(originalDesc);
        }
    }, [lang, originalDesc]);

    function handleClick() {
        navigate(`/details/${anime?.id}`);
    }

    return (
        <div className={styles.popularityItem}>
            <img
                src={anime?.coverImage?.large}
                alt={displayTitle}
                className={styles.thumbnail}
                onClick={handleClick}
            />

            <div className={styles.itemContent}>
                <div className={styles.itemTitleRow}>
                    <h3 className={styles.itemTitle} onClick={handleClick}>{displayTitle}</h3>
                    <div className={styles.sideBtn}>
                        <div className={styles.stars}>{stars}</div>
                        <FavoriteBtn isFavorite={favorites.includes(anime?.id)} id={anime?.id} />
                    </div>
                </div>
                <span className={styles.category}>{category}</span>
                <p
                    className={styles.description}
                    dangerouslySetInnerHTML={{ __html: translatedDesc?.replace(/(<br\s*\/?>\s*){2,}/gi, '<br>') }}
                ></p>
            </div>
        </div>
    );
};

export default PopularityListItem;
