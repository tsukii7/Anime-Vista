import React, { useState } from 'react';
import styles from './Similarities.module.css';
import SimilarityCard from './SimilarityCard';
import LoadingIndicator from "../../../components/LoadingIndicator.jsx";

const Similarities = ({ similarities }) => {
    const [showAll, setShowAll] = useState(false);

    const visibleList = showAll ? similarities : similarities.slice(0, 5);

    function handleShowClick() {
        setShowAll(!showAll);
    }

    function similarityCardCB(similarity, index) {
        return (
            similarity.id && <SimilarityCard
                key={index}
                data={similarity}
                id={index}
            />
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Similar Anime</h2>
                <button className={styles.toggle} onClick={handleShowClick}>
                    {similarities.length > 5 && (showAll ? 'show less' : 'show more')}
                </button>
            </div>

            <hr className={styles.divider}/>

            <div className={styles.grid}>
                {visibleList.length ?
                    visibleList.map(similarityCardCB) :
                    <LoadingIndicator isLoading={false} hasError={true} text={'Nothing found...'}/>
                }
            </div>
        </div>
    );
};

export default Similarities;
