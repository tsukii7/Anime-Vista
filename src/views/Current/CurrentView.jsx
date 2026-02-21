import SeasonTitle from "./components/SeasonTitle";
import Switcher from "./components/Switcher";
import CurrentTimelineView from "./CurrentTimelineView";
import styles from "./CurrentView.module.css";
import Pagination from "../../components/Pagination";
import CurrentListView from "./CurrentListView";
import LoadingIndicator from "../../components/LoadingIndicator";

export default function CurrentView({seasonAnime, animeListByDate, timePointPositions, onRefsReady,
    currentPage, totalPages, status, onPageChange, viewOption, setViewOption, currentViewStatus}) {


    return (
        <div className={styles["current-view"]}>
            <div className={styles["current-view-topbar"]}>
                <SeasonTitle/>
                <Switcher
                    setViewOption={setViewOption}
                    viewOption={viewOption}/>
            </div>
            {currentViewStatus === 'loading' && (<LoadingIndicator/>)}
            {currentViewStatus === 'failed' && (
                <div className={styles["error-message"]}>
                    <LoadingIndicator isLoading={false} hasError={true}/>
                </div>
            )}
            {status === 'succeeded' && (
                <div>
                    <div>
                        {viewOption === "Timeline" ? (
                            <CurrentTimelineView
                                animeListByDate={animeListByDate}
                                timePointPositions={timePointPositions}
                                onRefsReady={onRefsReady}
                            />
                        ) : (
                            <CurrentListView
                                seasonAnime={seasonAnime}
                            />
                        )}
                    </div>
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={onPageChange}/>
                </div>
            )}
        </div>
    )

}
