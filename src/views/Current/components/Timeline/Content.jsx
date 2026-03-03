import { useRef, useEffect } from 'react';
import BriefCard from './BriefCard';
import style from "../../CurrentView.module.css";

export default function Content({ animeListByDate, onRefsReady, favoriteIds }) {
    const refs = useRef([]);
    const favoriteSet = new Set((favoriteIds || []).map((id) => Number(id)));

    useEffect(() => {
        // 每次列表变化（包括切换“仅看已收藏”）时，重新测量所有可见日期块的位置。
        const observer = new ResizeObserver(() => {
            const elements = refs.current.slice(0, animeListByDate.length).filter(Boolean);
            if (!elements.length) return;

            const positions = elements.map(el =>
                el?.offsetTop - (el?.offsetParent?.offsetTop || 0)
            );
            onRefsReady(positions);
        });

        // 只保留当前页需要的 ref，避免长度比 animeListByDate 还长导致不触发更新
        refs.current = refs.current.slice(0, animeListByDate.length);
        refs.current.forEach(el => el && observer.observe(el));

        return () => {
            observer.disconnect();
        };
    }, [animeListByDate, onRefsReady]);

    function dailyContentRenderCB(animePerDay, index) {
        return (
            <div
                className={style["daily-content"]}
                key={index}
                id={"date-" + animePerDay.date}
                ref={(el) => (refs.current[index] = el)}>

                {animePerDay.animes.map(animeRenderCB)}

            </div>
        );
    }
    function animeRenderCB(anime, index) {
        return (
            anime && <BriefCard
                key={index}
                image={anime?.coverImage}
                title={anime?.title}
                episode={anime?.episode}
                time={anime?.airingAt}
                id={anime?.id}
                anime={anime?.anime}
                synonyms={anime?.anime?.synonyms ?? anime?.synonyms}
                isFavorite={favoriteSet.has(Number(anime?.id))}
            />
        );
    }

    return (
        <div className={style["content"]}>
            {animeListByDate.map(dailyContentRenderCB)}
        </div>
    );
}

