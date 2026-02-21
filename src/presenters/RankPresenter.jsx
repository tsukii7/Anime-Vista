import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRankingList, setPage } from '../models/rank/rankingSlice';
import RankView from '../views/Rank/RankView';

const RankPresenter = () => {
    const dispatch = useDispatch();
    const { sortType, currentPage } = useSelector((state) => state.ranking);

    useEffect(() => {
        dispatch(fetchRankingList({ sortType, page: currentPage }));
    }, [sortType, currentPage, dispatch]);

    const handlePageChange = (page) => {
        dispatch(setPage(page));
    };

    return <RankView onPageChange={handlePageChange} />;
};

export default RankPresenter;
