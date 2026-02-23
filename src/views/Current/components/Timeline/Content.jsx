import { useRef, useEffect } from 'react';
import BriefCard from './BriefCard';
import style from "../../CurrentView.module.css";

export default function Content({ animeListByDate, onRefsReady, favoriteIds }) {
    const refs = useRef([]);
    const favoriteSet = new Set((favoriteIds || []).map((id) => Number(id)));

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (refs.current.length === animeListByDate.length) {
                const positions = refs.current.map(el =>
                    el?.offsetTop - el?.offsetParent?.offsetTop || 0
                );
                onRefsReady(positions);
            }
        });

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

