import style from "../../CurrentView.module.css";

export default function TimePoint({ letter, date, weekday }){
    return(
        <div className={style.TimePoint}>
            <div className={style.TimePointLetter}>
                {letter}
            </div>
            <div className={style.TimePointText}>
                <span className={style.TimePointHeader}>{date}</span>
                <span className={style.TimePointDot}></span>
                <span className={style.TimePointSubheader}>{weekday}</span>
            </div>
        </div>
    )
}