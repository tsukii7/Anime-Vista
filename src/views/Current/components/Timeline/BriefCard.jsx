import styles from "../../CurrentView.module.css";
import { useNavigate } from "react-router";
import { useLanguage } from '../../../../i18n/LanguageContext.jsx';
import { getDisplayTitle } from '../../../../utils/animeUtils.js';

export default function BriefCard({ image, title, episode, time, id, anime }) {
    const { lang } = useLanguage();
    const navigate = useNavigate();
    const translatedTitle = getDisplayTitle(anime || { id, title, coverImage: { large: image }, synonyms: [] }, lang);
    const displayImage = anime?.coverImage?.large || image;

    function handleClick() {
        navigate(`/details/${id || anime?.id}`);
    }
    return (
        <div className={styles["brief-card"]}>
            <img src={displayImage} alt={translatedTitle} className={styles["anime-image"]} onClick={handleClick} />
            <div className={styles["anime-info"]}>
                <h3 className={styles["anime-title"]} onClick={handleClick}>{translatedTitle}</h3>
                <p className={styles["anime-episode"]}>{lang === 'zh' ? `第 ${episode} 集 于 ${time}播出` : `Ep ${episode} aired at ${time}`}</p>
            </div>
        </div>
    )
}