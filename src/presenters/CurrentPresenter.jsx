import { useEffect, useState, useRef } from "react";
import CurrentView from "../views/Current/CurrentView.jsx";
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchAnimeTimeLine,
    setTimelinePage
} from "../models/current/timelineSlice.js";
import {
    fetchAnimeList,
    fetchSeasonTotalCount,
    setListPage
} from "../models/current/listSlice.js";
import { useUserFavorites } from "../firebase/db.js";

export default function CurrentPresenter() {
    const dispatch = useDispatch();
    const [animeListByDate, setAnimeListByDate] = useState([]);
    const [timePointPositions, setTimePointPositions] = useState([]);
    const [viewOption, setViewOption] = useState('List');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const favorites = useUserFavorites();

    const {
        groupedAnime,
        status: timelineStatus,
        error: timelineError,
        currentPage: timelineCurrentPage,
        totalPages: timelineTotalPages
    } = useSelector((state) => state.timeline);

    const {
        seasonAnime,
        status: listStatus,
        error: listError,
        currentPage: listCurrentPage,
        totalPages: listTotalPages
    } = useSelector((state) => state.list);

    const isTimeline = viewOption === 'Timeline';
    const currentStatus = isTimeline ? timelineStatus : listStatus;
    const currentError = isTimeline ? timelineError : listError;
    const currentPage = isTimeline ? timelineCurrentPage : listCurrentPage;
    const totalPages = isTimeline ? timelineTotalPages : listTotalPages;
    const setPage = isTimeline ? setTimelinePage : setListPage;

    const timelinePromiseRef = useRef(null);
    const listPromiseRef = useRef(null);
    const countPromiseRef = useRef(null);
    const hasTimelineLoaded = useRef(false);
    const hasListCountLoaded = useRef(false);
    const lastListPageFetched = useRef(null);
    const abortThunkPromise = (promise) => {
        if (promise && typeof promise.abort === 'function') {
            promise.abort();
        }
    };

    useEffect(() => {
        if (!isTimeline) return;
        if (!hasTimelineLoaded.current) {
            abortThunkPromise(timelinePromiseRef.current);
            timelinePromiseRef.current = dispatch(fetchAnimeTimeLine());
            hasTimelineLoaded.current = true;
        }
    }, [isTimeline, dispatch]);

    useEffect(() => {
        if (isTimeline) return;

        if (!hasListCountLoaded.current) {
            abortThunkPromise(countPromiseRef.current);
            countPromiseRef.current = dispatch(fetchSeasonTotalCount());
            hasListCountLoaded.current = true;
        }

        if (lastListPageFetched.current !== listCurrentPage || listStatus === 'idle') {
            abortThunkPromise(listPromiseRef.current);
            listPromiseRef.current = dispatch(fetchAnimeList({ page: listCurrentPage }));
            lastListPageFetched.current = listCurrentPage;
        }
    }, [isTimeline, listCurrentPage, listStatus, dispatch]);

    useEffect(() => {
        return () => {
            abortThunkPromise(timelinePromiseRef.current);
            abortThunkPromise(listPromiseRef.current);
            abortThunkPromise(countPromiseRef.current);
        };
    }, []);

    useEffect(() => {
        if (isTimeline && groupedAnime?.length > 0) {
            const animePerPage = 10;
            const start = (currentPage - 1) * animePerPage;
            const pageItems = groupedAnime?.slice(start, start + animePerPage) || [];
            if (!showFavoritesOnly) {
                setAnimeListByDate(pageItems);
                return;
            }

            const favoriteSet = new Set((favorites || []).map((id) => Number(id)));
            const filteredByFavorite = pageItems
                .map((day) => ({
                    ...day,
                    animes: (day?.animes || []).filter((anime) =>
                        favoriteSet.has(Number(anime?.id))
                    ),
                }))
                .filter((day) => day.animes.length > 0);

            setAnimeListByDate(filteredByFavorite);
        }
    }, [groupedAnime, currentPage, isTimeline, showFavoritesOnly, favorites]);

    function onPageChange(newPage) {
        dispatch(setPage(newPage));
    }

    function handleRefsReady(heights) {
        setTimePointPositions(heights);
    }

    return (
        <CurrentView
            seasonAnime={seasonAnime}
            animeListByDate={animeListByDate}
            timePointPositions={timePointPositions}
            onRefsReady={handleRefsReady}
            currentPage={currentPage}
            totalPages={totalPages}
            status={currentStatus}
            onPageChange={onPageChange}
            viewOption={viewOption}
            setViewOption={setViewOption}
            showFavoritesOnly={showFavoritesOnly}
            setShowFavoritesOnly={setShowFavoritesOnly}
            favoriteIds={favorites}
            currentViewStatus={currentStatus}
            error={currentError}
        />
    );
}
