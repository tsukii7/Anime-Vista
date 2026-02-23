import { useState, useEffect } from 'react';
import { translateToChinese } from './translateText';

export const translateTagSync = (tag, t, lang) => {
    if (!tag) return '';

    // 1. Try direct exact match from i18n first
    const exactMatch = t(`search.genreList.${tag}`);
    if (exactMatch !== `search.genreList.${tag}`) return exactMatch;

    if (lang !== 'zh') return tag;

    // 2. Chinese Pattern Recognition (Regex)

    // Pattern: Primarily X Cast -> Essentially X Role
    const castMatch = tag.match(/^Primarily (.*) Cast$/);
    if (castMatch) {
        const role = castMatch[1];
        const roleZh = t(`search.genreList.${role}`) !== `search.genreList.${role}` ? t(`search.genreList.${role}`) : role;
        return `以${roleZh}为主`;
    }

    // Pattern: X Protagonist -> X Protagonist
    const protagMatch = tag.match(/^(.*) Protagonist$/);
    if (protagMatch) {
        const type = protagMatch[1];
        const typeZh = t(`search.genreList.${type}`) !== `search.genreList.${type}` ? t(`search.genreList.${type}`) : type;
        return `${typeZh}主角`;
    }

    // Pattern: X Themes -> X Themes
    const themeMatch = tag.match(/^(.*) Themes$/);
    if (themeMatch) {
        const theme = themeMatch[1];
        const themeZh = t(`search.genreList.${theme}`) !== `search.genreList.${theme}` ? t(`search.genreList.${theme}`) : theme;
        return `${themeZh}主题`;
    }

    // Pattern: X Manipulation -> X Manipulation
    const manipulationMatch = tag.match(/^(.*) Manipulation$/i);
    if (manipulationMatch) {
        const target = manipulationMatch[1];
        const targetZh = t(`search.genreList.${target}`) !== `search.genreList.${target}` ? t(`search.genreList.${target}`) : target;
        return `${targetZh}操作`;
    }

    // 3. Common Anime Tropes & Prefixes
    if (tag.includes("Cute Girls Doing Cute Things")) return "萌系";
    if (tag.includes("Boys' Love")) return "耽美";
    if (tag.includes("Girls' Love")) return "百合";

    return null; // Return null to indicate no sync match found
};

export const useTagTranslation = (tag, t, lang) => {
    const syncResult = translateTagSync(tag, t, lang);
    const [translatedTag, setTranslatedTag] = useState(syncResult || tag);

    useEffect(() => {
        const res = translateTagSync(tag, t, lang);
        if (res) {
            setTranslatedTag(res);
            return;
        }

        if (lang === 'zh' && tag) {
            translateToChinese(tag).then(setTranslatedTag);
        } else {
            setTranslatedTag(tag);
        }
    }, [tag, lang, t]);

    return translatedTag;
};

// Deprecated: use useTagTranslation hook instead. 
// Kept for simple sync fallback if needed
export const translateTag = (tag, t, lang) => {
    return translateTagSync(tag, t, lang) || tag;
};
