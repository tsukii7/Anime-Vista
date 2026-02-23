import * as React from 'react';
import IntroCard from '../../../components/card/IntroCard.jsx';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import { getDisplayTitle } from '../../../utils/animeUtils.js';

const updatedText = (anime, lang) => {
  if (anime?.nextAiringEpisode) {
    return lang === 'zh' ? `更新至第 ${anime?.nextAiringEpisode.episode} 集` : `Update to ${anime?.nextAiringEpisode.episode} episode`;
  } else {
    return lang === 'zh' ? `${anime?.episodes ? '共 ' + anime?.episodes + ' 集' : ''}` : `${anime?.episodes ? anime?.episodes + ' episodes in total' : ''}`;
  }
}
const ResultCard = ({ anime }) => {
  const { lang } = useLanguage();
  const title = getDisplayTitle(anime, lang);

  return (
    anime && <IntroCard
      key={anime?.id}
      id={anime?.id}
      anime={anime}
      image={anime?.coverImage?.large || '/default-cover.jpg'}
      rating={anime?.averageScore || 0}
      updatedText={updatedText(anime, lang)}
    />
  );
};

export default ResultCard;
