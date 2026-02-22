import React, { useState, useEffect } from 'react';
import styles from './IntroCard.module.css';
import { useNavigate } from "react-router";
import { StarIcon, HeartIcon } from "./IntroCardComponents.jsx";
import FavoriteBtn from "../FavoriteBtn.jsx";
import { useUserFavorites } from "../../firebase/db.js";
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { translateToChinese } from '../../utils/translateText.js';
import { getDisplayTitle, standardizeDescription, prepareDescriptionForTranslation, finalizeDescriptionAfterTranslation } from '../../utils/animeUtils.js';
import TranslatedTag from '../TranslatedTag.jsx';

export default function IntroCard({
    id,
    title,
    description,
    image,
    duration,
    genres,
    id_id,
    rating = 100,
    updatedText = 'Update to xx episode',
    tags = [],
    anime, // New prop
}) {
    const navigate = useNavigate();
    const { lang, t } = useLanguage();
    const favorites = useUserFavorites();
    const targetAnime = anime || { id, title, description, coverImage: { large: image }, genres: tags || genres, synonyms: [] };
    const [translatedDesc, setTranslatedDesc] = useState(targetAnime.description);
    const displayTitle = getDisplayTitle(targetAnime, lang);
    const currentId = id || targetAnime.id;
    const currentTags = tags.length > 0 ? tags : (targetAnime.genres || []);

    useEffect(() => {
        const desc = targetAnime.description;
        if (lang === 'zh' && desc && desc !== 'N/A') {
            const { text } = prepareDescriptionForTranslation(desc, targetAnime);
            translateToChinese(text).then(res => {
                const final = finalizeDescriptionAfterTranslation(res, targetAnime, lang);
                setTranslatedDesc(final);
            });
        } else {
            const standardized = standardizeDescription(desc, targetAnime, lang);
            setTranslatedDesc(standardized);
        }
    }, [lang, targetAnime.description]);

    function handleClick() {
        navigate(`/details/${currentId}`);
    }

    const cleanDescription = (translatedDesc || '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/?[^>]+(>|$)/g, '')
        .replace(/\n{2,}/g, '\n')
        .trim();
    const starCount = Math.round(rating / 20);
    return (
        <div className={styles.card}>
            <div className={styles.coverContainer}>
                <img src={image} alt="cover" className={styles.coverImage} onClick={handleClick} />
                <div className={styles.updateLabel}>{updatedText}</div>
            </div>

            <div className={styles.infoSection}>
                <div className={styles.headerRow}>
                    <h2 className={styles.title} title={displayTitle} onClick={handleClick}>{displayTitle}</h2>
                </div>
                <div className={styles.ratingRow}>
                    <span>
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} filled={i < starCount} />
                        ))}
                    </span>
                    <FavoriteBtn isFavorite={favorites.includes(currentId)} id={currentId} />
                </div>

                <p className={styles.description} style={{ whiteSpace: 'pre-wrap' }}>
                    {cleanDescription}
                </p>

                <div className={styles.tagContainer}>
                    {currentTags.map((tag, idx) => (
                        <TranslatedTag key={idx} tag={tag} className={styles.tag} />
                    ))}
                </div>
            </div>
        </div>
    );
}