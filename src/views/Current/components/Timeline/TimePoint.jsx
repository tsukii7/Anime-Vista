import style from "../../CurrentView.module.css";
import { useLanguage } from '../../../../i18n/LanguageContext.jsx';

export default function TimePoint({ letter, date, weekday }) {
    const { lang } = useLanguage();
    const weekMap = {
        'Mon': '周一',
        'Tue': '周二',
        'Wed': '周三',
        'Thu': '周四',
        'Fri': '周五',
        'Sat': '周六',
        'Sun': '周日'
    };
    const ZHWeekday = weekMap[weekday] || weekday;
    const displayLetter = lang === 'zh' ? ZHWeekday.replace('周', '') : letter;
    const displayWeekday = lang === 'zh' ? ZHWeekday : weekday;
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