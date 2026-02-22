import React, { useEffect, useState, useRef } from "react";
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

export default function CurrentPresenter() {
    const dispatch = useDispatch();
    const [animeListByDate, setAnimeListByDate] = useState([]);
    const [timePointPositions, setTimePointPositions] = useState([]);
    const [viewOption, setViewOption] = useState('List');

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
    const lastListPageFetched = useRef(null);

    useEffect(() => {
        if (isTimeline) {
            if (!hasTimelineLoaded.current) {
                if (timelinePromiseRef.current) timelinePromiseRef.current.abort();
                timelinePromiseRef.current = dispatch(fetchAnimeTimeLine());
                hasTimelineLoaded.current = true;
            }
        } else {
            // Season List View
            const needsCount = listTotalPages === 1; // Initial state
            if (needsCount) {
                if (countPromiseRef.current) countPromiseRef.current.abort();
                countPromiseRef.current = dispatch(fetchSeasonTotalCount());
            }

            if (lastListPageFetched.current !== currentPage || listStatus === 'idle') {
                if (listPromiseRef.current) listPromiseRef.current.abort();
                listPromiseRef.current = dispatch(fetchAnimeList({ page: currentPage }));
                lastListPageFetched.current = currentPage;
            }
        }

        return () => {
            // Optional: abort everything on unmount
            // timelinePromiseRef.current?.abort();
            // listPromiseRef.current?.abort();
            // countPromiseRef.current?.abort();
        };
    }, [viewOption, currentPage, dispatch, isTimeline]);

    useEffect(() => {
        if (isTimeline && groupedAnime?.length > 0) {
            const animePerPage = 10;
            const start = (currentPage - 1) * animePerPage;
            setAnimeListByDate(groupedAnime?.slice(start, start + animePerPage));
        }
    }, [groupedAnime, currentPage, isTimeline]);

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
            currentViewStatus={currentStatus}
            error={currentError}
        />
    );
}
