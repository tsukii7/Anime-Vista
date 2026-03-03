import SeasonTitle from "./components/SeasonTitle";
import Switcher from "./components/Switcher";
import CurrentTimelineView from "./CurrentTimelineView";
import styles from "./CurrentView.module.css";
import Pagination from "../../components/Pagination";
import CurrentListView from "./CurrentListView";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function CurrentView({ seasonAnime, animeListByDate, timePointPositions, onRefsReady,
    currentPage, totalPages, status, onPageChange, viewOption, setViewOption, showFavoritesOnly, setShowFavoritesOnly, favoriteIds, isLoggedIn, currentViewStatus, error }) {
    const { lang, t } = useLanguage();
    const showFavoritesOnlyBtn = viewOption === "Timeline" && isLoggedIn;
    const isEmptyFavoritesFilter = viewOption === "Timeline" && showFavoritesOnly && (!favoriteIds || favoriteIds.length === 0);

    return (
        <div className={styles["current-view"]}>
            <div className={styles["current-view-topbar"]}>
                <SeasonTitle />
                <div className={styles["current-topbar-actions"]}>
                    {showFavoritesOnlyBtn && (
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
            <div className={styles["current-view-body"]}>
                {currentViewStatus === 'loading' && (
                    <div className={styles["center-stage"]}>
                        <LoadingIndicator />
                    </div>
                )}
                {currentViewStatus === 'failed' && (
                    <div className={styles["center-stage"]}>
                        <LoadingIndicator isLoading={false} hasError={true} text={error} />
                    </div>
                )}
                {status === 'succeeded' && (
                    <div className={styles["current-view-content"]}>
                        {viewOption === "Timeline" ? (
                            isEmptyFavoritesFilter ? (
                                <div className={styles["center-stage"]}>
                                    <LoadingIndicator
                                        isLoading={false}
                                        hasError={true}
                                        text={t('current.noFavoritesInTimeline') || (lang === 'zh' ? '暂无收藏，先去点个收藏再回来吧～' : 'No favorites yet. Add some and come back!')}
                                    />
                                </div>
                            ) : (
                                <CurrentTimelineView
                                    animeListByDate={animeListByDate}
                                    timePointPositions={timePointPositions}
                                    onRefsReady={onRefsReady}
                                    favoriteIds={favoriteIds}
                                />
                            )
                        ) : (
                            <CurrentListView
                                seasonAnime={seasonAnime}
                            />
                        )}
                    </div>
                )}
            </div>
            {status === 'succeeded' && (
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    )

}
