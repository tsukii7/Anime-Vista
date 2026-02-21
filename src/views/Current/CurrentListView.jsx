import IntroCard from "../../components/card/IntroCard.jsx";
import styles from "./CurrentView.module.css";
export default function CurrentListView({seasonAnime}) {
    const updatedText = (anime) => {
        if (!anime?.nextAiringEpisode && !anime?.episodes) return '';
        if (anime?.nextAiringEpisode) {
            return `Update to ${anime?.nextAiringEpisode.episode} episode`;
        } else {
            return `${anime?.episodes?anime?.episodes+' episodes in total':''}`;
        }
    }
        function animeRenderCB(anime, index){
            return(
                anime && <IntroCard
                    key={anime?.id || index}
                    image={anime?.coverImage.large}
                    title={anime?.title.romaji}
                    rating={anime?.averageScore || 0}
                    description={anime?.description || ""}
                    tags={anime?.genres || []}
                    updatedText={updatedText(anime)}
                    id={anime?.id}
                />
            );
        }
    return (
        <div className={styles.listView}>
            {seasonAnime?.map(animeRenderCB)}
        </div>
    );
}