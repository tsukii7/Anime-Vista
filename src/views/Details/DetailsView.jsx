import React, { useState, useEffect } from 'react';
import Introduction from './components/Introduction';
import Parameters from './components/Parameters';
import Characters from './components/Characters';
import Staffs from './components/Staffs';
import Similarities from './components/Similarities';
import Comments from './components/Comments';
import Statistics from './components/Statistics';

import styles from './DetailsView.module.css';
import {
    listenToComments,
    useUserFavorites
} from "../../firebase/db.js";
import { isLoggedIn } from "../../firebase/auth.js";
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { getDisplayTitle, getChineseTitle } from '../../utils/animeUtils.js';

const DetailsView = ({ anime }) => {
    const { t, lang } = useLanguage();
    function capitalizeFirstLetter(string) {
        return string?.charAt(0).toUpperCase() + string?.slice(1).toLowerCase();
    }

    function filterTags(tags) {
        return tags
            ?.filter(tag => tag.category !== 'Sexual Content')
            .filter(tag => !tag.name.toLowerCase().includes('sex'))
            .sort((a, b) => b.rank - a.rank)
            .slice(0, 5)
            .map(tag => tag.name) || []
    }

    const favorites = useUserFavorites();

    const [introduction, setIntroduction] = useState(null);
    useEffect(() => {
        setIntroduction({
            id: anime?.id,
            title: getDisplayTitle(anime, lang),
            altTitle: lang === 'zh' ? (anime?.title?.english || anime?.title?.romaji) : anime?.title?.native,
            coverImage: anime?.coverImage.large,
            isFavorite: favorites.includes(anime?.id),
            startDate: `${anime?.startDate?.year}-${anime?.startDate?.month}-${anime?.startDate?.day}`,
            status: capitalizeFirstLetter(anime?.status),
            nextEpisode: anime?.nextAiringEpisode?.episode,
            description: anime?.description,
            tags: filterTags(anime?.tags),
        })
    }, [anime, favorites, lang]);

    function animeParams(anime) {
        function getTimeDifferenceString(targetTimestamp) {
            if (!targetTimestamp) return null;

            const now = new Date();
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const targetDate = new Date(targetTimestamp * 1000);

            const nowInTZ = new Date(now.toLocaleString('en-US', { timeZone }));
            const targetInTZ = new Date(targetDate.toLocaleString('en-US', { timeZone }));

            let diff = targetInTZ - nowInTZ;

            if (diff < 0) return null;

            const minutes = Math.floor(diff / (1000 * 60)) % 60;
            const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));

            return `${days}d ${hours}h ${minutes}m`;
        }

        // Airing, Format, Episodes, Episode Duration, Status,
        // Start Date, End Date, Season, Average Score, Mean Score,
        // Popularity, Favorites, Studios, Producers, Source
        // Hashtag, Genres, Romaji, English, Native, Synonyms
        return [
            { label: t('details.airing').replace(':', ''), value: getTimeDifferenceString(anime?.nextAiringEpisode?.airingAt) || 'N/A' },
            { label: t('details.format'), value: anime?.format || 'N/A' },
            { label: t('details.episodes'), value: anime?.episodes || 'N/A' },
            { label: t('details.duration'), value: anime?.duration ? `${anime?.duration} min` : 'N/A' },
            { label: t('details.status'), value: anime?.status ? capitalizeFirstLetter(anime?.status) : 'N/A' },
            { label: t('details.startDate'), value: anime?.startDate?.year ? `${anime?.startDate.year}-${anime?.startDate.month}-${anime?.startDate.day}` : 'N/A' },
            { label: t('details.endDate'), value: anime?.endDate?.year ? `${anime?.endDate.year}-${anime?.endDate.month}-${anime?.endDate.day}` : 'N/A' },
            { label: t('details.season'), value: anime?.season && anime?.seasonYear ? `${capitalizeFirstLetter(anime?.season)} ${anime?.seasonYear}` : 'N/A' },
            { label: t('details.averageScore'), value: anime?.averageScore ? `${anime?.averageScore}%` : 'N/A' },
            { label: t('details.meanScore'), value: anime?.meanScore ? `${anime?.meanScore}%` : 'N/A' },
            { label: t('details.popularity'), value: anime?.popularity || 'N/A' },
            { label: t('details.favorites'), value: anime?.favourites || 'N/A' },
            { label: t('details.studios'), value: anime?.studios?.nodes.slice(0, 1)?.map(studio => studio.name).join('\n') || 'N/A' },
            { label: t('details.producers'), value: anime?.studios?.nodes.slice(1)?.map(producer => producer.name).join('\n') || 'N/A' },
            { label: t('details.source'), value: anime?.source ? capitalizeFirstLetter(anime?.source) : 'N/A' },
            { label: t('details.hashtag'), value: anime?.hashtag || 'N/A' },
            { label: t('details.genresLabel'), value: anime?.genres?.map(g => t(`search.genreList.${g}`) !== `search.genreList.${g}` ? t(`search.genreList.${g}`) : g).join('\n') || 'N/A' },
            { label: t('details.romaji'), value: anime?.title?.romaji || 'N/A' },
            { label: t('details.english'), value: anime?.title?.english || 'N/A' },
            { label: t('details.native'), value: anime?.title?.native || 'N/A' },
            { label: t('details.synonyms'), value: anime?.synonyms?.join('\n') || 'N/A' },
        ];
    }

    function animeStatistics(anime) {
        function rankingCB(ranking) {
            return `#${ranking.rank} ` +
                `${ranking.context.split(' ').map(capitalizeFirstLetter).join(' ')} ` +
                `${ranking.season ? `(${capitalizeFirstLetter(ranking.season)}) ` : ''}` +
                `${ranking.year}`
        }

        return {
            rating: {
                score: anime?.averageScore || 'N/A',
                prizes: anime?.rankings?.filter(ranking => ranking.type === 'RATED').map(rankingCB) || [],
            },
            popularity: {
                score: anime?.popularity || 'N/A',
                prizes: anime?.rankings?.filter(ranking => ranking.type === 'POPULAR').map(rankingCB) || [],
            },
            favorites: {
                score: anime?.favourites || 'N/A',
            }
        }
    }

    function animeCharacters(anime) {
        function characterEdgeCB(edge) {
            let nativeName = edge.node.name.native;
            let fullName = edge.node.name.full;

            if (!nativeName && fullName) {
                nativeName = fullName
                fullName = ''
            } else if (!nativeName && !fullName) {
                nativeName = 'N/A'
                fullName = ''
            }

            return {
                nativeName: nativeName,
                fullName: fullName,
                image: edge.node.image.large,
                role: capitalizeFirstLetter(edge.role),
                cv: edge.voiceActors?.[0]?.name?.full || null,
            }
        }

        return anime?.characters.edges?.map(characterEdgeCB) || []
    }


    function animeStaffs(anime) {
        function staffEdgeCB(edge) {
            return {
                role: edge.role,
                name: edge.node.name.full || 'N/A',
                image: edge.node.image.large,
            }
        }

        return anime?.staff.edges?.map(staffEdgeCB) || []
    }

    const [similarities, setSimilarities] = useState([]);
    useEffect(() => {
        const nodes = anime?.recommendations?.nodes || [];
        const results = nodes.filter(node => node.mediaRecommendation).map((node) => ({
            ...node,
            isFavorite: favorites.includes(node.mediaRecommendation.id)
        }));
        setSimilarities(results);
    }, [anime, favorites]);

    const [comments, setComments] = useState(null);
    useEffect(() => {
        const unsubscribe = listenToComments(anime?.id, (commentList) => {
            setComments({
                userInfo: { isLogin: isLoggedIn() },
                comments: commentList
            });
        });

        return () => unsubscribe();
    }, [anime]);

    if (!anime) return null;

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                {introduction && <Introduction introduction={introduction} anime={anime} />}
            </div>

            <div className={styles.middle}>
                <div className={styles.left}>
                    <Parameters parameters={animeParams(anime)} />
                </div>
                <div className={styles.right}>
                    <Statistics statistics={animeStatistics(anime)} />
                    <Characters characters={animeCharacters(anime)} />
                    <Staffs staffs={animeStaffs(anime)} />
                    {similarities && <Similarities similarities={similarities} />}
                </div>
            </div>

            <div className={styles.bottom}>
                {comments && (
                    <div className={styles.bottom}>
                        <Comments animeId={anime?.id} comments={comments} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailsView;
