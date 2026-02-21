// src/views/Home/components/PopularityListItem.jsx
import React from 'react';
import styles from '../HomeView.module.css';
import {useNavigate} from "react-router";
import FavoriteBtn from "../../../components/FavoriteBtn.jsx";
import {useUserFavorites} from "../../../firebase/db.js";

const PopularityListItem = ({ anime }) => {
    const stars = Array.from({ length: anime?.rating }, (_, i) => (
        <div key={i} className={styles.star} />
    ));
    const navigate = useNavigate();
    const favorites = useUserFavorites();
    function handleClick() {
        navigate(`/details/${anime?.id}`);
    }
    return (
        <div className={styles.popularityItem}>
            <img
                src={anime?.image}
                alt={anime?.title}
                className={styles.thumbnail}
                onClick={handleClick}
            />

            <div className={styles.itemContent}>
                <div className={styles.itemTitleRow}>
                    <h3 className={styles.itemTitle} onClick={handleClick}>{anime?.title}</h3>
                    <div className={styles.sideBtn}>
                        <div className={styles.stars}>{stars}</div>
                        <FavoriteBtn isFavorite={favorites.includes(anime?.id)} id={anime?.id}/>
                    </div>
                </div>
                <span className={styles.category}>{anime?.category}</span>
                <p
                    className={styles.description}
                    dangerouslySetInnerHTML={{ __html: anime?.description?.replace(/(<br\s*\/?>\s*){2,}/gi, '<br>')}}
                ></p>
            </div>

            <div className={styles.actionIcon}>
                <div className={styles.actionPlaceholder}></div>
            </div>
        </div>
    );
};

export default PopularityListItem;
