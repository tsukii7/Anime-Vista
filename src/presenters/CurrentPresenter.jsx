import React, { useEffect, useState } from "react";
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
        currentPage: timelineCurrentPage,
        totalPages: timelineTotalPages
    } = useSelector((state) => state.timeline);

    const {
        seasonAnime,
        status: listStatus,
        currentPage: listCurrentPage,
        totalPages: listTotalPages
    } = useSelector((state) => state.list);

    const isTimeline = viewOption === 'Timeline';
    const currentStatus = isTimeline ? timelineStatus : listStatus;
    const currentPage = isTimeline ? timelineCurrentPage : listCurrentPage;
    const totalPages = isTimeline ? timelineTotalPages : listTotalPages;
    const setPage = isTimeline ? setTimelinePage : setListPage;

    useEffect(() => {
        dispatch(setPage(1));

        if (isTimeline) {
            dispatch(fetchAnimeTimeLine());
        } else {
            dispatch(fetchSeasonTotalCount());
            dispatch(fetchAnimeList({ page: 1 }));
        }
    }, [viewOption, dispatch]);

    useEffect(() => {
        if (!isTimeline) {
            dispatch(fetchAnimeList({ page: currentPage }));
        }
    }, [currentPage, isTimeline, dispatch]);

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
        />
    );
}
