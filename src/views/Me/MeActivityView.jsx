import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ActivityCard from './components/ActivityCard';
import styles from './MeActivityView.module.css';
import Pagination from '../../components/Pagination';
import { setActivitiesPage } from '../../models/me/meSlice';
import LoadingIndicator from "../../components/LoadingIndicator.jsx";
import { listenToUserActivities } from "../../firebase/db.js";
import { useLanguage } from '../../i18n/LanguageContext.jsx';

const MeActivityView = ({ userId }) => {
    const { t } = useLanguage();
    const [allActivities, setAllActivities] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const dispatch = useDispatch();

    // Page state from Redux
    const { currentPage, itemsPerPage } = useSelector((state) => state.me.activities);

    const totalPages = Math.max(1, Math.ceil(allActivities.length / itemsPerPage));
    const activities = React.useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return allActivities.slice(start, start + itemsPerPage);
    }, [allActivities, currentPage, itemsPerPage]);

    React.useEffect(() => {
        if (!userId) {
            setLoading(false);
            setAllActivities([]);
            return;
        }

        setLoading(true);
        setError(null);

        const unsubscribe = listenToUserActivities(
            userId,
            dispatch,
            (activityList) => {
                setAllActivities(activityList);
                setLoading(false);
                setError(null);
            },
            (errMessage) => {
                setError(errMessage);
                setLoading(false);
            }
        );

        return () => {
            unsubscribe();
        };
    }, [userId, dispatch]);

    React.useEffect(() => {
        if (currentPage > totalPages) {
            dispatch(setActivitiesPage(totalPages));
        }
    }, [currentPage, totalPages, dispatch]);

    const handlePageChange = (newPage) => {
        dispatch(setActivitiesPage(newPage));
    };

    if (loading) {
        return <div className={styles.errorMessage}><LoadingIndicator /></div>;
    }

    if (error) {
        return (
            <div className={styles.errorMessage}>
                <LoadingIndicator isLoading={false} hasError={true} text={error} />
            </div>
        );
    }

    if (!loading && allActivities.length === 0) {
        return (
            <div className={styles.errorMessage}>
                <LoadingIndicator isLoading={false} hasError={false} text={t('me.noActivities')} />
            </div>
        );
    }

    return (
        <div className={styles.activityContainer}>
            {activities.map(activity => (
                <ActivityCard
                    key={activity.id}
                    userAvatar={activity.userAvatar}
                    username={activity.username}
                    date={activity.date}
                    commentText={activity.commentText}
                    anime={activity.anime}
                    likeCount={activity.likeCount}
                    animeId={activity.animeId}
                    id={activity.id}
                    hasLiked={activity.hasLiked}
                />
            ))}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default MeActivityView;
