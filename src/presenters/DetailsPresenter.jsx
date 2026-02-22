import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnimeDetails } from '../models/details/detailsSlice';
import DetailsView from '../views/Details/DetailsView';
import { useParams } from 'react-router';
import LoadingIndicator from '../components/LoadingIndicator';

// Force refresh - optimization version 1.1
const DetailsPresenter = () => {
    const dispatch = useDispatch();
    const { animeId } = useParams();

    const { anime, status, error } = useSelector((state) => state.details);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        if (animeId) {
            // Caching logic: Only fetch if the current anime in store doesn't match the URL ID
            const isAlreadyLoaded = anime && String(anime.id) === String(animeId);

            if (!isAlreadyLoaded) {
                // Cancel any existing pending requests for previous IDs
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }
                abortControllerRef.current = new AbortController();

                dispatch(fetchAnimeDetails(Number(animeId)));
            }
        }

        return () => {
            // Cleanup: abort on unmount or ID change
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [animeId, dispatch]);

    // Derived state: are we currently trying to load a DIFFERENT anime than what's in the store?
    const isFetchingNewId = animeId && (!anime || String(anime.id) !== String(animeId));

    if (status === 'loading' && isFetchingNewId) return <LoadingIndicator />;
    if (status === 'failed') return <LoadingIndicator isLoading={false} hasError={true} text={error} />;

    return <DetailsView anime={anime} />;
};

export default DetailsPresenter;
