import React, { useState, useEffect } from 'react';
import styles from './Introduction.module.css';
import '../../../styles/global.css';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteBtn from "../../../components/FavoriteBtn.jsx";
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import { translateToChinese } from '../../../utils/translateText.js';
import { getDisplayTitle, standardizeDescription, prepareDescriptionForTranslation, finalizeDescriptionAfterTranslation } from '../../../utils/animeUtils.js';
import TranslatedTag from '../../../components/TranslatedTag.jsx';

const Introduction = ({ introduction, anime }) => {
    const { t, lang } = useLanguage();
    const {
        id,
        title,
        altTitle,
        coverImage,
        isFavorite,
        startDate,
        status,
        nextEpisode,
        description,
        tags,
    } = introduction;

    const [translatedDesc, setTranslatedDesc] = useState(description);
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        if (lang === 'zh') {
            if (description) {
                setIsTranslating(true);
                const { text } = prepareDescriptionForTranslation(description, anime);
                translateToChinese(text).then((res) => {
                    const final = finalizeDescriptionAfterTranslation(res, anime, lang);
                    setTranslatedDesc(final);
                    setIsTranslating(false);
                });
            }
        } else {
            const standardized = standardizeDescription(description, anime, lang);
            setTranslatedDesc(standardized);
        }
    }, [lang, description, anime]);

    function tagCB(tag, index) {
        return (
            <TranslatedTag
                key={index}
                tag={tag}
                className={styles.tag}
            />
        );
    }

    function statusString() {
        if (!Number.isFinite(nextEpisode)) return '';
        if (nextEpisode <= 0) return '';

        if (nextEpisode === 1) return t('details.airing') || 'No episode available';

        return `${t('details.airing') || 'Update to '} ${nextEpisode - 1} ${t('details.episodes') || 'episode'}`;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.altTitle}>{altTitle}</p>
                </div>
                <div className={styles.heartBtn}>
                    <FavoriteBtn isFavorite={isFavorite} id={id} className={styles.favoriteBtn} />
                    <span className={styles.favoriteText}>{isFavorite ? (t('details.favorited') || 'Favorited') : (t('details.addToFavorites') || 'Add to my favorite')}</span>
                </div>
            </div>

            <div className={styles.content}>
                <img className={styles.cover} src={coverImage} alt="anime visual" />
                <div className={styles.details}>
                    <p className={styles.statusLine}>
                        <span className={styles.statusLineIn}>
                            {`[ ${startDate} / `}
                        </span>
                        <span className={styles.statusLineIn}>
                            {t(`details.${String(status).toLowerCase()}`) || status}
                        </span>
                        <span className={styles.statusLineIn}>
                            {(statusString() && ' / ' + statusString()) + ' ]'}
                        </span>
                    </p>

                    <div className={styles.introduction}>
                        {isTranslating ?
                            <p style={{ fontStyle: 'italic', opacity: 0.7 }}>{t('common.translating') || 'Translating...'}</p> :
                            <p dangerouslySetInnerHTML={{ __html: translatedDesc }} />
                        }
                    </div>

                    <div className={styles.tags}>
                        {tags?.map(tagCB)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Introduction;
