import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPopularityList, setPopularityPage} from '../../../models/home/popularityListSlice';
import PopularityListItem from './PopularityListItem';
import styles from '../HomeView.module.css';
import LoadingIndicator from "../../../components/LoadingIndicator.jsx";
import Pagination from "../../../components/Pagination";

const PopularityList = () => {
    const dispatch = useDispatch();
    const {list, status, error, currentPage, totalPages} = useSelector((state) => state.popularityList);

    useEffect(() => {
        dispatch(fetchPopularityList({page: currentPage}));
    }, [currentPage, dispatch]);

    const handlePageChange = (page) => {
        dispatch(setPopularityPage(page));
    };

    if (status === 'loading') return <LoadingIndicator/>;
    if (status === 'failed') return <LoadingIndicator isLoading={false} hasError={true}/>;

    return (
        <div>
            <div className={styles.popularityList}>
                {list.map((anime) => (
                    anime && <PopularityListItem
                        key={anime?.id}
                        anime={{
                            id: anime?.id || 'N/A',
                            title: anime?.title.romaji || 'N/A',
                            image: anime?.coverImage.large,
                            category: `${anime?.genres[0] || 'Unknown'} • ${anime?.startDate.year}-${anime?.startDate.month}-${anime?.startDate.day}`,
                            description: (anime?.description?.length > 500
                                ? anime?.description.slice(0, 1000) + '...'
                                : anime?.description) || 'N/A',
                            rating: Math.round((anime?.averageScore || 0) / 20) || 'N/A',
                        }}
                    />
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default PopularityList;
