import * as React from 'react';
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
    const naText = t('details.na') || 'N/A';
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

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const [introduction, setIntroduction] = React.useState(null);
    React.useEffect(() => {
        if (!mounted) return;
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
    }, [anime, favorites, lang, mounted]);


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

            return `${days}${t('details.dayShort')} ${hours}${t('details.hourShort')} ${minutes}${t('details.minuteShort')}`;
        }

        // Airing, Format, Episodes, Episode Duration, Status,
        // Start Date, End Date, Season, Average Score, Mean Score,
        // Popularity, Favorites, Studios, Producers, Source
        // Hashtag, Genres, Romaji, English, Native, Synonyms
        return [
            { label: t('details.airing').replace(':', ''), value: (mounted ? getTimeDifferenceString(anime?.nextAiringEpisode?.airingAt) : null) || naText },

            { label: t('details.format'), value: anime?.format || naText },
            { label: t('details.episodes'), value: anime?.episodes || naText },
            { label: t('details.duration'), value: anime?.duration ? `${anime?.duration} ${t('details.minuteUnit')}` : naText },
            { label: t('details.status'), value: anime?.status ? capitalizeFirstLetter(anime?.status) : naText },
            { label: t('details.startDate'), value: anime?.startDate?.year ? `${anime?.startDate.year}-${anime?.startDate.month}-${anime?.startDate.day}` : naText },
            { label: t('details.endDate'), value: anime?.endDate?.year ? `${anime?.endDate.year}-${anime?.endDate.month}-${anime?.endDate.day}` : naText },
            { label: t('details.season'), value: anime?.season && anime?.seasonYear ? `${capitalizeFirstLetter(anime?.season)} ${anime?.seasonYear}` : naText },
            { label: t('details.averageScore'), value: anime?.averageScore ? `${anime?.averageScore}%` : naText },
            { label: t('details.meanScore'), value: anime?.meanScore ? `${anime?.meanScore}%` : naText },
            { label: t('details.popularity'), value: anime?.popularity || naText },
            { label: t('details.favorites'), value: anime?.favourites || naText },
            { label: t('details.studios'), value: anime?.studios?.nodes.slice(0, 1)?.map(studio => studio.name).join('\n') || naText },
            { label: t('details.producers'), value: anime?.studios?.nodes.slice(1)?.map(producer => producer.name).join('\n') || naText },
            { label: t('details.source'), value: anime?.source ? capitalizeFirstLetter(anime?.source) : naText },
            { label: t('details.hashtag'), value: anime?.hashtag || naText },
            { label: t('details.genresLabel'), value: anime?.genres?.map(g => t(`search.genreList.${g}`) !== `search.genreList.${g}` ? t(`search.genreList.${g}`) : g).join('\n') || naText },
            { label: t('details.romaji'), value: anime?.title?.romaji || naText },
            { label: t('details.english'), value: anime?.title?.english || naText },
            { label: t('details.native'), value: anime?.title?.native || naText },
            { label: t('details.synonyms'), value: anime?.synonyms?.join('\n') || naText },
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
                score: anime?.averageScore || naText,
                prizes: anime?.rankings?.filter(ranking => ranking.type === 'RATED').map(rankingCB) || [],
            },
            popularity: {
                score: anime?.popularity || naText,
                prizes: anime?.rankings?.filter(ranking => ranking.type === 'POPULAR').map(rankingCB) || [],
            },
            favorites: {
                score: anime?.favourites || naText,
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
                nativeName = naText
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
                name: edge.node.name.full || naText,
                image: edge.node.image.large,
            }
        }

        return anime?.staff.edges?.map(staffEdgeCB) || []
    }

    const [similarities, setSimilarities] = React.useState([]);
    React.useEffect(() => {
        const nodes = anime?.recommendations?.nodes || [];
        const results = nodes.filter(node => node.mediaRecommendation).map((node) => ({
            ...node,
            isFavorite: favorites.includes(node.mediaRecommendation.id)
        }));
        setSimilarities(results);
    }, [anime, favorites]);

    const [comments, setComments] = React.useState(null);
    React.useEffect(() => {
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
