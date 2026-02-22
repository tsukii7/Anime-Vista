import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRankingList, setPage } from '../models/rank/rankingSlice';
import RankView from '../views/Rank/RankView';

const RankPresenter = () => {
    const dispatch = useDispatch();
    const { list, status, sortType, currentPage } = useSelector((state) => state.ranking);
    const lastFetchRef = useRef({ sortType: null, page: null });
    const fetchPromiseRef = useRef(null);

    useEffect(() => {
        // Caching: Only fetch if the criteria changed from what we last FAMILIARLY fetched
        const isAlreadyLoaded = lastFetchRef.current.sortType === sortType &&
            lastFetchRef.current.page === currentPage &&
            status === 'succeeded';

        if (!isAlreadyLoaded) {
            if (fetchPromiseRef.current) {
                fetchPromiseRef.current.abort();
            }
            fetchPromiseRef.current = dispatch(fetchRankingList({ sortType, page: currentPage }));
            lastFetchRef.current = { sortType, page: currentPage };
        }

        return () => {
            if (fetchPromiseRef.current) {
                fetchPromiseRef.current.abort();
            }
        };
    }, [sortType, currentPage, dispatch]);

    const handlePageChange = (page) => {
        dispatch(setPage(page));
    };

    return <RankView onPageChange={handlePageChange} />;
};

export default RankPresenter;
