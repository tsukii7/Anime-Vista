import React from 'react';
import styles from './SimilarityCard.module.css';
import '../../../styles/global.css';
import {NavLink} from 'react-router';
import FavoriteBtn from "../../../components/FavoriteBtn.jsx";

const SimilarityCard = ({data}) => {
    const {id, image, title, tags, isFavorite} = data;

    function tagCB(tag, index) {
        return (
            <span key={index} className={styles.tag}>{tag}</span>
        );
    }

    return (
        <div className={styles.card}>
            <NavLink to={`/details/${id}`} className={styles.link}>
                <img src={image} alt={title} className={styles.image} />
                <div className={styles.titleRow}>
                    <div className={styles.title}>{title}</div>
                    <FavoriteBtn isFavorite={isFavorite} id={id}/>
                </div>
            </NavLink>

            <div className={styles.footer}>
                <div className={styles.tags}>
                    Tags:
                    {tags.length ? tags.map(tagCB) : ' N/A'}
                </div>
            </div>
        </div>
    );
};

export default SimilarityCard;
