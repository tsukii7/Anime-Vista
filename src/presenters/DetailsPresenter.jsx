import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnimeDetails } from '../models/details/detailsSlice';
import DetailsView from '../views/Details/DetailsView';
import { useParams } from 'react-router';
import LoadingIndicator from '../components/LoadingIndicator';

const DetailsPresenter = () => {
    const dispatch = useDispatch();
    const { animeId } = useParams();

    const { anime, status, error } = useSelector((state) => state.details);

    useEffect(() => {
        if (animeId) {
            dispatch(fetchAnimeDetails(animeId));
        }
    }, [animeId, dispatch]);

    if (status === 'loading') return <LoadingIndicator />;
    if (status === 'failed') return <LoadingIndicator isLoading={false} hasError={true}/>;

    return <DetailsView anime={anime} />;
};

export default DetailsPresenter;
