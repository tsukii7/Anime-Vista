import style from "../../CurrentView.module.css";
import { useLanguage } from '../../../../i18n/LanguageContext.jsx';

export default function TimePoint({ letter, date, weekday }) {
    const { lang, t } = useLanguage();
    const translatedWeekday = t(`common.weekdays.${weekday}`) !== `common.weekdays.${weekday}`
        ? t(`common.weekdays.${weekday}`)
        : weekday;
    const displayLetter = lang === 'zh' ? translatedWeekday.replace('周', '') : letter;
    const displayWeekday = lang === 'zh' ? translatedWeekday : weekday;
    return (
        <div className={style.TimePoint}>
            <div className={style.TimePointLetter}>
                {displayLetter}
            </div>
            <div className={style.TimePointText}>
                <span className={style.TimePointHeader}>{date}</span>
                <span className={style.TimePointDot}></span>
                <span className={style.TimePointSubheader}>{displayWeekday}</span>
            </div>
        </div>
    )
}