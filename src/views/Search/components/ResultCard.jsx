import React from 'react';
import IntroCard from '../../../components/card/IntroCard.jsx';

const formatDate = (date) => {
  if (!date?.year) return 'TBA';
  return `${date.year}/${date.month?.toString().padStart(2, '0') || '??'}`;
};
const updatedText = (anime) => {
  if (anime?.nextAiringEpisode) {
    return `Update to ${anime?.nextAiringEpisode.episode} episode`;
  } else {
    return `${anime?.episodes?anime?.episodes+' episodes in total':''}`;
  }
}
const ResultCard = ({ anime }) => {
  const title = anime?.title.romaji;

  return (
      anime && <IntroCard
      image={anime?.coverImage?.large || '/default-cover.jpg'}
      title={title}
      rating={anime?.averageScore || 0}
      description={anime?.description || ""}
      tags={anime?.genres || []}
      updatedText={updatedText(anime)}
      id={anime?.id}
    />
  );
};

export default ResultCard;
