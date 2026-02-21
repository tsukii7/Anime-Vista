import React from 'react';
import styles from './Introduction.module.css';
import '../../../styles/global.css';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {addFavorite, removeFavorite} from "../../../firebase/db.js";
import {getCurrentUser} from "../../../firebase/auth.js";
import FavoriteBtn from "../../../components/FavoriteBtn.jsx";

const Introduction = ({introduction}) => {
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

    async function handleFavoriteClickACB(event) {
        event.preventDefault();

        if (isFavorite) {
            await removeFavorite(getCurrentUser().userId, id)
        } else {
            await addFavorite(getCurrentUser().userId, id)
        }
    }

    function tagCB(tag, index) {
        return (
            <span key={index} className={styles.tag}>
                {tag}
            </span>
        )
    }

    function statusString() {
        if(!Number.isFinite(nextEpisode)) return '';
        if(nextEpisode <= 0) return '';

        if (nextEpisode === 1) return 'No episode available';

        return `Update to ${nextEpisode - 1} episode`;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.altTitle}>{altTitle}</p>
                </div>
                <div className={styles.heartBtn}>
                    <FavoriteBtn isFavorite={isFavorite} id={id} className={styles.favoriteBtn}/>
                    <span className={styles.favoriteText}>Add to my favorite</span>
                </div>
            </div>

            <div className={styles.content}>
                <img className={styles.cover} src={coverImage} alt="anime visual"/>
                <div className={styles.details}>
                    <p className={styles.statusLine}>
                        <span className={styles.statusLineIn}>
                            {`[Start on ${startDate} / `}
                        </span>
                        <span className={styles.statusLineIn}>
                           {status}
                        </span>
                        <span className={styles.statusLineIn}>
                            {(statusString() && ' / ' + statusString())+']'}
                        </span>
                    </p>

                    <p className={styles.introduction} dangerouslySetInnerHTML={{ __html: description }} />

                    <div className={styles.tags}>
                        {tags.map(tagCB)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Introduction;
