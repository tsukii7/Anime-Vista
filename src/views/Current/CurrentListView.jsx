import IntroCard from "../../components/card/IntroCard.jsx";
import styles from "./CurrentView.module.css";
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { getDisplayTitle } from '../../utils/animeUtils.js';

export default function CurrentListView({ seasonAnime }) {
    const { lang } = useLanguage();
    const updatedText = (anime) => {
        if (!anime?.nextAiringEpisode && !anime?.episodes) return '';
        if (anime?.nextAiringEpisode) {
            return lang === 'zh' ? `更新至第 ${anime?.nextAiringEpisode.episode} 集` : `Update to ${anime?.nextAiringEpisode.episode} episode`;
        } else {
            return lang === 'zh' ? `${anime?.episodes ? '共 ' + anime?.episodes + ' 集' : ''}` : `${anime?.episodes ? anime?.episodes + ' episodes in total' : ''}`;
        }
    }
    function animeRenderCB(anime, index) {
        return (
            anime && <IntroCard
                key={anime?.id || index}
                id={anime?.id}
                anime={anime}
                image={anime?.coverImage?.large}
                rating={anime?.averageScore || 0}
                updatedText={updatedText(anime)}
            />
        );
    }
    return (
        <div className={styles.listView}>
            {seasonAnime?.map(animeRenderCB)}
        </div>
    );
}