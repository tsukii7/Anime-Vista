import React from 'react';
import Timeline from './components/Timeline/Time.jsx';
import styles from "./CurrentView.module.css";
import Content from "./components/Timeline/Content.jsx";

export default function CurrentTimelineView({ animeListByDate, timePointPositions, onRefsReady }) {
    return (
        <div className={styles["currentTimeline-view"]}>
            <div className={styles["currentTimeline-sidebar"]}>
                <Timeline
                    animeListByDate={animeListByDate}
                    timePointPositions={timePointPositions}
                />
            </div>

            <Content
                animeListByDate={animeListByDate}
                onRefsReady={onRefsReady}
            />
        </div>
    );
}
