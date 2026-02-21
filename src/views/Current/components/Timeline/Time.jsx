import React from "react";
import TimePoint from "./TimePoint";
import style from "../../CurrentView.module.css";

export default function Timeline({ animeListByDate, timePointPositions }) {
    return (
        <div className={style.Timeline}>
            {animeListByDate.map((day, index) => (
                <div
                    key={index}
                    className={style.TimePointWrapper}
                    style={{ top: `${timePointPositions[index]-200}px` }}
                >
                    <TimePoint
                        letter={day.weekday[0]}
                        date={day.date}
                        weekday={day.weekday}
                    />
                </div>
            ))}
        </div>
    );
}
