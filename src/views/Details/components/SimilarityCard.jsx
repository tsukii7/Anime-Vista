import React from 'react';
import styles from './SimilarityCard.module.css';
import '../../../styles/global.css';
import { NavLink } from 'react-router';
import FavoriteBtn from "../../../components/FavoriteBtn.jsx";
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import { getDisplayTitle } from '../../../utils/animeUtils';
import TranslatedTag from '../../../components/TranslatedTag.jsx';

const SimilarityCard = ({ anime, isFavorite }) => {
    const { lang, t } = useLanguage();
    const title = getDisplayTitle(anime, lang);
    const image = anime?.coverImage?.large;
    const id = anime?.id;
    const tags = anime?.tags ? [...anime.tags].sort((a, b) => b.rank - a.rank).slice(0, 5).map(tag => tag.name) : [];

    function tagCB(tag, index) {
        return (
            <TranslatedTag
                key={index}
                tag={tag}
                className={styles.tag}
            />
        );
    }

    return (
        <div className={styles.card}>
            <NavLink to={`/details/${id}`} className={styles.link}>
                <img src={image} alt={title} className={styles.image} />
                <div className={styles.titleRow}>
                    <div className={styles.title}>{title}</div>
                    <FavoriteBtn isFavorite={isFavorite} id={id} />
                </div>
            </NavLink>

            <div className={styles.footer}>
                <div className={styles.tags}>
                    {t('details.tags') || 'Tags'}:
                    {tags.length ? tags.map(tagCB) : ' N/A'}
                </div>
            </div>
        </div>
    );
};

export default SimilarityCard;
