import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularityList, setPopularityPage } from '../../../models/home/popularityListSlice';
import PopularityListItem from './PopularityListItem';
import styles from '../HomeView.module.css';
import LoadingIndicator from "../../../components/LoadingIndicator.jsx";
import Pagination from "../../../components/Pagination";
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import { getDisplayTitle } from '../../../utils/animeUtils.js';

const PopularityList = () => {
    const dispatch = useDispatch();
    const { list, status, currentPage, totalPages, error } = useSelector((state) => state.popularityList);
    const { lang, t } = useLanguage();

    const fetchPromiseRef = React.useRef(null);
    const lastPageFetched = React.useRef(null);

    React.useEffect(() => {
        if (lastPageFetched.current !== currentPage || status === 'idle') {
            if (fetchPromiseRef.current) fetchPromiseRef.current.abort();
            fetchPromiseRef.current = dispatch(fetchPopularityList({ page: currentPage }));
            lastPageFetched.current = currentPage;
        }

        return () => {
            if (fetchPromiseRef.current) fetchPromiseRef.current.abort();
        };
    }, [currentPage, dispatch]);

    const handlePageChange = (page) => {
        dispatch(setPopularityPage(page));
    };

    if (status === 'loading') return <LoadingIndicator />;
    if (status === 'failed') return <LoadingIndicator isLoading={false} hasError={true} text={error || t('common.error') || "Oops! Something went wrong..."} />;

    return (
        <div>
            <div className={styles.popularityList}>
                {list.map((anime) => (
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
