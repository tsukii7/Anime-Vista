import { getCurrentSeason } from "../../../models/current/timelineSlice";
import styles from "../CurrentView.module.css";
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

export default function SeasonTitle() {
    const { lang } = useLanguage();
    const currentSeason = getCurrentSeason();

    const seasonZh = {
        'Spring': '春季',
        'Summer': '夏季',
        'Fall': '秋季',
        'Autumn': '秋季',
        'Winter': '冬季'
    };

    const seasonLabel = lang === 'zh'
        ? (seasonZh[currentSeason.season] || currentSeason.season)
        : currentSeason.season;
    return (
        <div className={styles["season-title"]}>
            {currentSeason.year}{" "}{seasonLabel}
        </div>
    )
}