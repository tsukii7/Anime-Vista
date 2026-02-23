import IntroCard from "../../components/card/IntroCard.jsx";
import styles from "./CurrentView.module.css";
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { getDisplayTitle } from '../../utils/animeUtils.js';

export default function CurrentListView({ seasonAnime }) {
    const { t } = useLanguage();
    const formatText = (template, params) =>
        Object.entries(params).reduce(
            (acc, [key, value]) => acc.replace(`{${key}}`, value),
            template
        );

    const updatedText = (anime) => {
        if (!anime?.nextAiringEpisode && !anime?.episodes) return '';
        if (anime?.nextAiringEpisode) {
            return formatText(t('current.updatedToEpisode'), {
                episode: anime?.nextAiringEpisode.episode
            });
        } else {
            return anime?.episodes
                ? formatText(t('current.totalEpisodes'), { episodes: anime?.episodes })
                : '';
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