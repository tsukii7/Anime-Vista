import { getCurrentSeason } from "../../../models/current/timelineSlice";
import styles from "../CurrentView.module.css";
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

export default function SeasonTitle() {
    const { lang, t } = useLanguage();
    const currentSeason = getCurrentSeason();

    const seasonLabel = lang === 'zh'
        ? (t(`common.seasons.${currentSeason.season}`) !== `common.seasons.${currentSeason.season}`
            ? t(`common.seasons.${currentSeason.season}`)
            : currentSeason.season)
        : currentSeason.season;
    return (
        <div className={styles["season-title"]}>
            {currentSeason.year}{" "}{seasonLabel}
        </div>
    )
}