import React from 'react';
import styles from './IntroCard.module.css';
import { useNavigate } from "react-router";
import {StarIcon, HeartIcon} from "./IntroCardComponents.jsx";
import FavoriteBtn from "../FavoriteBtn.jsx";
import {useUserFavorites} from "../../firebase/db.js";

export default function IntroCard({
    image,
    title,
    rating = 100,
    description,
    tags = [],
    updatedText = 'Update to xx episode',
    id,
}) {
    const navigate = useNavigate();
    const favorites = useUserFavorites();

    function handleClick() {
        navigate(`/details/${id}`);
    }

    const cleanDescription = description
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/?[^>]+(>|$)/g, '')
        .replace(/\n{2,}/g, '\n')
        .trim();
    const starCount = Math.round(rating / 20);
    return (
        <div className={styles.card}>
            <div className={styles.coverContainer}>
                <img src={image} alt="cover" className={styles.coverImage} onClick={handleClick}/>
                <div className={styles.updateLabel}>{updatedText}</div>
            </div>

            <div className={styles.infoSection}>
                <div className={styles.headerRow}>
                    <h2 className={styles.title} title={title} onClick={handleClick}>{title}</h2>
                </div>
                <div className={styles.ratingRow}>
                    <span>
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} filled={i < starCount} />
                        ))}
                    </span>
                    <FavoriteBtn isFavorite={favorites.includes(id)} id={id}/>
                </div>

                <p className={styles.description} style={{ whiteSpace: 'pre-wrap' }}>
                    {cleanDescription}
                </p>

                <div className={styles.tagContainer}>
                    {tags.map((tag, idx) => (
                        <span key={idx} className={styles.tag}>{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}