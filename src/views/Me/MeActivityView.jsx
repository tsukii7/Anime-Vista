import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import ActivityCard from './components/ActivityCard';
import styles from './MeActivityView.module.css';
import Pagination from '../../components/Pagination';
import {setActivitiesPage} from '../../models/me/meSlice';
import LoadingIndicator from "../../components/LoadingIndicator.jsx";
import {listenToUserActivities} from "../../firebase/db.js";

const MeActivityView = ({userId}) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const {currentPage, totalPages, itemsPerPage} = useSelector((state) => state.me.activities);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const unsubscribe = listenToUserActivities(
            userId,
            currentPage,
            itemsPerPage,
            dispatch,
            (activityList) => {
                setActivities(activityList);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId, currentPage, itemsPerPage, dispatch]);

    const handlePageChange = (newPage) => {
        dispatch(setActivitiesPage(newPage));
    };

    if (loading) {
        return <div className={styles.errorMessage}><LoadingIndicator/></div>;
    }

    if (!loading && activities.length === 0) {
        return <div className={styles.errorMessage}>
            <LoadingIndicator
                isLoading={false}
                hasError={true}
                text={'No activities yet'}
            />
        </div>;
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
                    animeImage={activity.animeImage}
                    animeTitle={activity.animeTitle}
                    animeScore={activity.animeScore}
                    likeCount={activity.likeCount}
                    animeId={activity.animeId}
                    id={activity.id}
                    hasLiked={activity.hasLiked}
                />
            ))}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default MeActivityView;
