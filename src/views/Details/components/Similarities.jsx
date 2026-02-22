import React, { useState } from 'react';
import styles from './Similarities.module.css';
import SimilarityCard from './SimilarityCard';
import LoadingIndicator from "../../../components/LoadingIndicator.jsx";
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

const Similarities = ({ similarities }) => {
    const [showAll, setShowAll] = useState(false);
    const { t } = useLanguage();

    const visibleList = showAll ? similarities : similarities.slice(0, 5);

    function handleShowClick() {
        setShowAll(!showAll);
    }

    function similarityCardCB(similarity, index) {
        const media = similarity.mediaRecommendation;
        return (
            media?.id && <SimilarityCard
                key={index}
                anime={media}
                isFavorite={similarity.isFavorite}
            />
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>{t('details.similarAnime') || 'Similar Anime'}</h2>
                <button className={styles.toggle} onClick={handleShowClick}>
                    {similarities.length > 5 && (showAll ? (t('common.showLess') || 'show less') : (t('common.showMore') || 'show more'))}
                </button>
            </div>

            <hr className={styles.divider} />

            <div className={styles.grid}>
                {visibleList.length ?
                    visibleList.map(similarityCardCB) :
                    <LoadingIndicator isLoading={false} hasError={true} text={t('details.nothingFound') || 'Nothing found...'} />
                }
            </div>
        </div>
    );
};

export default Similarities;
