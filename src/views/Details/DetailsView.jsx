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

const DetailsView = ({ anime }) => {
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
            title: anime?.title.romaji,
            altTitle: anime?.title.native,
            coverImage: anime?.coverImage.large,
            isFavorite: favorites.includes(anime?.id),
            startDate: `${anime?.startDate?.year}-${anime?.startDate?.month}-${anime?.startDate?.day}`,
            status: capitalizeFirstLetter(anime?.status),
            nextEpisode: anime?.nextAiringEpisode?.episode,
            description: anime?.description,
            tags: filterTags(anime?.tags),
        })
    }, [anime, favorites]);

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
            { label: 'Airing', value: getTimeDifferenceString(anime?.nextAiringEpisode?.airingAt) || 'N/A' },
            { label: 'Format', value: anime?.format || 'N/A' },
            { label: 'Episodes', value: anime?.episodes || 'N/A' },
            { label: 'Episode Duration', value: anime?.duration ? `${anime?.duration} min` : 'N/A' },
            { label: 'Status', value: capitalizeFirstLetter(anime?.status) || 'N/A' },
            { label: 'Start Date', value: anime?.startDate ? `${anime?.startDate?.year}-${anime?.startDate?.month}-${anime?.startDate?.day}` : 'N/A' },
            { label: 'End Date', value: anime?.endDate ? `${anime?.endDate?.year}-${anime?.endDate?.month}-${anime?.endDate?.day}` : 'N/A' },
            { label: 'Season', value: anime?.season && anime?.seasonYear ? `${capitalizeFirstLetter(anime?.season)} ${anime?.seasonYear}` : 'N/A' },
            { label: 'Average Score', value: anime?.averageScore ? `${anime?.averageScore}%` : 'N/A' },
            { label: 'Mean Score', value: anime?.meanScore ? `${anime?.meanScore}%` : 'N/A' },
            { label: 'Popularity', value: anime?.popularity || 'N/A' },
            { label: 'Favorites', value: anime?.favourites || 'N/A' },
            { label: 'Studios', value: anime?.studios?.nodes.slice(0, 1)?.map(studio => studio.name).join('\n') || 'N/A' },
            { label: 'Producers', value: anime?.studios?.nodes.slice(1)?.map(producer => producer.name).join('\n') || 'N/A' },
            { label: 'Source', value: capitalizeFirstLetter(anime?.source) || 'N/A' },
            { label: 'Hashtag', value: anime?.hashtag || 'N/A' },
            { label: 'Genres', value: anime?.genres?.join('\n') || 'N/A' },
            { label: 'Romaji', value: anime?.title.romaji || 'N/A' },
            { label: 'English', value: anime?.title.english || 'N/A' },
            { label: 'Native', value: anime?.title.native || 'N/A' },
            { label: 'Synonyms', value: anime?.synonyms?.join('\n') || 'N/A' },
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

    const [similarities, setSimilarities] = useState(null);
    useEffect(() => {
        const nodes = anime?.recommendations?.nodes || [];
        const results = nodes.filter(node => node.mediaRecommendation).map((similarity) => {
            const media = similarity.mediaRecommendation;
            return {
                id: media?.id,
                image: media?.coverImage.large,
                title: media?.title.romaji,
                isFavorite: favorites.includes(media?.id),
                tags: filterTags(media?.tags),
            };
        });

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
                {introduction && <Introduction introduction={introduction} />}
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
