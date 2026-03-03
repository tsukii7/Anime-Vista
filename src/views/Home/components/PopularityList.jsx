import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularityList, setPopularityPage } from '../../../models/home/popularityListSlice';
import PopularityListItem from './PopularityListItem';
import styles from '../HomeView.module.css';
import LoadingIndicator from "../../../components/LoadingIndicator.jsx";
import Pagination from "../../../components/Pagination";
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

const PopularityList = () => {
    const dispatch = useDispatch();
    const { list, status, currentPage, totalPages, error } = useSelector((state) => state.popularityList);
    const { t } = useLanguage();

    React.useEffect(() => {
        const request = dispatch(fetchPopularityList());
        return () => {
            if (request && typeof request.abort === 'function') {
                request.abort();
            }
        };
    }, [dispatch]);

    const handlePageChange = (page) => {
        dispatch(setPopularityPage(page));
    };

    if (status === 'loading') return <LoadingIndicator />;
    if (status === 'failed') return <LoadingIndicator isLoading={false} hasError={true} text={error || t('common.error') || "Oops! Something went wrong..."} />;

    const pageSize = 10;
    const start = (currentPage - 1) * pageSize;
    const visibleList = list.slice(start, start + pageSize);

    return (
        <div>
            <div className={styles.popularityList}>
                {visibleList.map((anime) => (
                    anime && <PopularityListItem
                        key={anime?.id}
                        anime={anime}
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
