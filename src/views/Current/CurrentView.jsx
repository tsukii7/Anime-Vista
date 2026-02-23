import SeasonTitle from "./components/SeasonTitle";
import Switcher from "./components/Switcher";
import CurrentTimelineView from "./CurrentTimelineView";
import styles from "./CurrentView.module.css";
import Pagination from "../../components/Pagination";
import CurrentListView from "./CurrentListView";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function CurrentView({ seasonAnime, animeListByDate, timePointPositions, onRefsReady,
    currentPage, totalPages, status, onPageChange, viewOption, setViewOption, showFavoritesOnly, setShowFavoritesOnly, favoriteIds, currentViewStatus, error }) {
    const { lang } = useLanguage();


    return (
        <div className={styles["current-view"]}>
            <div className={styles["current-view-topbar"]}>
                <SeasonTitle />
                <div className={styles["current-topbar-actions"]}>
                    {viewOption === "Timeline" && (
                        <button
                            type="button"
                            className={`${styles["favorite-filter-button"]} ${showFavoritesOnly ? styles["favorite-filter-button-active"] : ""}`}
                            onClick={() => setShowFavoritesOnly((prev) => !prev)}
                        >
                            {lang === 'zh' ? '仅看已收藏' : 'Favorites only'}
                            {Array.isArray(favoriteIds) ? ` (${favoriteIds.length})` : ''}
                        </button>
                    )}
                    <Switcher
                        setViewOption={setViewOption}
                        viewOption={viewOption} />
                </div>
            </div>
            {currentViewStatus === 'loading' && (<LoadingIndicator />)}
            {currentViewStatus === 'failed' && (
                <div className={styles["error-message"]}>
                    <LoadingIndicator isLoading={false} hasError={true} text={error} />
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
                                favoriteIds={favoriteIds}
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
                        onPageChange={onPageChange} />
                </div>
            )}
        </div>
    )

}
