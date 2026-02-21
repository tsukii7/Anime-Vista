import { getCurrentSeason } from "../../../models/current/timelineSlice";
import styles from "../CurrentView.module.css";

export default function SeasonTitle(){
    const currentSeason = getCurrentSeason();
    return (
        <div className= {styles["season-title"]}>
            {currentSeason.year}{" "}{currentSeason.season}
        </div>
    )
}