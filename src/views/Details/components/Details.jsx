import styles from './Details.module.css';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

const Details = ({ anime }) => {
    const { t } = useLanguage();
    return (
        <div className={styles.banner} style={{ backgroundImage: `url(${anime?.bannerImage})` }}>
            <div className={styles.container}>
                <img className={styles.cover} src={anime?.coverImage.large} alt='title' />
                <div className={styles.meta}>
                    <h1 className={styles.title}>{anime?.title.native}</h1>
                    <p className={styles.score}>⭐ {anime?.averageScore ? (anime?.averageScore / 10).toFixed(1) : 'N/A'}</p>
                    <p className={styles.genres}>{anime?.genres?.map(genre => t(`search.genreList.${genre}`) !== `search.genreList.${genre}` ? t(`search.genreList.${genre}`) : genre).join(' / ')}</p>
                    <p className={styles.info}>
                        {anime?.episodes} episodes · {anime?.duration} min / ep
                    </p>
                    <p className={styles.date}>
                        Start: {anime?.startDate?.year || 'Unknown'}-{anime?.startDate?.month}-{anime?.startDate?.day}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Details;
