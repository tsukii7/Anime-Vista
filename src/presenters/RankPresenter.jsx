import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRankingList, setPage } from '../models/rank/rankingSlice';
import RankView from '../views/Rank/RankView';

const RankPresenter = () => {
    const dispatch = useDispatch();
    const { list, status, sortType, currentPage } = useSelector((state) => state.ranking);
    const lastFetchRef = React.useRef({ sortType: null, page: null });
    const fetchPromiseRef = React.useRef(null);
    const abortThunkPromise = (promise) => {
        if (promise && typeof promise.abort === 'function') {
            promise.abort();
        }
    };

    React.useEffect(() => {
        // Caching: Only fetch if the criteria changed from what we last FAMILIARLY fetched
        const isAlreadyLoaded = lastFetchRef.current.sortType === sortType &&
            lastFetchRef.current.page === currentPage &&
            status === 'succeeded';

        if (!isAlreadyLoaded) {
            abortThunkPromise(fetchPromiseRef.current);
            fetchPromiseRef.current = dispatch(fetchRankingList({ sortType, page: currentPage }));
            lastFetchRef.current = { sortType, page: currentPage };
        }

        return () => {
            abortThunkPromise(fetchPromiseRef.current);
        };
    }, [sortType, currentPage, status, dispatch]);

    const handlePageChange = (page) => {
        dispatch(setPage(page));
    };

    return <RankView onPageChange={handlePageChange} />;
};

export default RankPresenter;
