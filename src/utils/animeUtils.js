import { t2s } from './opencc';

export const hasChinese = (str) => /[\u4e00-\u9fa5]/.test(str);
export const hasKana = (str) => /[\u3040-\u309F\u30A0-\u30FF]/.test(str);

// Characteristic Simplified/Traditional Chinese characters for fine-grained detection
const SC_ONLY = "爱罢备贝笔毕边变滨宾点尔儿发范飞丰风复干赶个巩沟构柜过还后胡壶继家价艰惊竞旧举句惧军开兰拦劳乐离里丽两连了龙吗买麦门难鸟聂宁农齐岂气弃谦牵桥驱躯气亲轻庆穷权劝确让扰认闪筛杀伤审实识时适书术数树说苏虽随态糖汤腾铁听厅头团弯万为卫稳务吴武献乡响项箫啸写虽协羞修叙养样叶医已义议异荫应英婴赢鱼与玉御远园愿跃运杂泽扎斋战张长账赵这征睁挣执职帜终种肿众昼朱烛属术注专准浊总纵处";
const TC_ONLY = "愛罷備貝筆畢邊變濱賓點爾兒發範飛豐風復幹趕個鞏溝構櫃過還後胡壺繼家價艱漸驚競舊舉句懼軍開蘭攔勞樂離裏麗兩連了龍嗎買麥門黽難鳥聶寧農齊豈氣棄謙牽牽橋驅軀氣親輕慶窮權勸確讓擾認閃篩殺傷審實識時適書術數樹說蘇雖隨態糖湯騰鐵聽廳頭團彎萬為衛穩務吳武獻鄉響項簫嘯寫雖協羞修敘養樣葉醫已義議異蔭應英嬰贏魚與玉御遠園願躍運雜澤扎齋戰張長賬趙這征睜掙執職幟終種腫眾晝朱燭屬術注專准濁總縱處";

export const isSimplified = (str) => {
    if (!str) return false;
    for (const char of SC_ONLY) if (str.includes(char)) return true;
    return false;
};

export const isTraditional = (str) => {
    if (!str) return false;
    for (const char of TC_ONLY) if (str.includes(char)) return true;
    return false;
};

const isLikelyChinese = (str) => hasChinese(str) && !hasKana(str);

export const getChineseTitle = (anime) => {
    if (!anime || !anime.title) return '';

    // Step 1: Look for Simplified Chinese (SC) directly
    // The trace.moe proxy may inject 'chinese' into the title object
    if (anime.title.chinese && isSimplified(anime.title.chinese)) return anime.title.chinese;

    // Step 2: Look for Simplified Chinese (SC) in Synonyms
    if (anime.synonyms && Array.isArray(anime.synonyms)) {
        const scSynonym = anime.synonyms.find(s => isLikelyChinese(s) && isSimplified(s));
        if (scSynonym) return scSynonym;
    }

    // Step 3: Native title (Donghua often use this for Chinese titles)
    if (isLikelyChinese(anime.title?.native || '') && isSimplified(anime.title.native)) return anime.title.native;

    // Step 4: Look for Traditional Chinese (TC) directly
    if (anime.title.chinese && isTraditional(anime.title.chinese)) return anime.title.chinese;

    // Step 5: Look for Traditional Chinese (TC) in Synonyms
    if (anime.synonyms && Array.isArray(anime.synonyms)) {
        const tcSynonym = anime.synonyms.find(s => isLikelyChinese(s) && isTraditional(s));
        if (tcSynonym) return tcSynonym;
    }

    // Step 6: Traditional Chinese in Native
    if (isLikelyChinese(anime.title?.native || '') && isTraditional(anime.title.native)) return anime.title.native;

    // Step 7: Fallback: Any Chinese-like string in Synonyms
    const genericZh = anime.synonyms?.find(isLikelyChinese);
    if (genericZh) return genericZh;

    // Step 8: Final fallback to the injected chinese field if any
    if (anime.title.chinese) return anime.title.chinese;

    return null;
};

export const getDisplayTitle = (anime, lang) => {
    if (!anime || !anime.title) return 'No Title';

    // Handle case where title is just a string
    if (typeof anime.title === 'string') {
        const title = anime.title;
        if (lang === 'zh') {
            return hasChinese(title) ? t2s(title) : title;
        }
        return title;
    }

    // Handle case where title is an object (standard AniList/Proxy format)
    if (lang === 'zh') {
        const zhTitle = getChineseTitle(anime);
        if (zhTitle) {
            // Apply OpenCC (TC -> SC) if it's Chinese but not purely English
            return hasChinese(zhTitle) ? t2s(zhTitle) : zhTitle;
        }

        const fallback = anime.title?.native || anime.title?.romaji || 'No Title';
        return hasChinese(fallback) ? t2s(fallback) : fallback;
    }

    return anime.title?.english || anime.title?.romaji || 'No Title';
};

export const getBaseTitle = (title) => {
    if (!title || typeof title !== 'string') return title;
    // Strip common season/part suffixes: "Season 2", "2nd Season", "Part 2", "II", "第2季", "第二季" etc.
    // Handles English, Roman numerals, and Chinese season patterns
    return title.replace(/(\s+)?(Season\s+\d+|Part\s+\d+|\d+(st|nd|rd|th)\s+Season|I+|第[一二三四五六七八九十\d]+季)(\s+)?$/i, '').trim();
};

export const standardizeDescription = (description, anime, lang) => {
    if (!description || !anime || lang !== 'zh') return description;

    const displayTitle = getDisplayTitle(anime, lang);
    if (!displayTitle || displayTitle === 'No Title') return description;

    const baseDisplayTitle = getBaseTitle(displayTitle);

    // Collect all potential names to replace
    const namesToReplace = new Set();

    // Add all title variants
    if (anime.title?.romaji) namesToReplace.add(anime.title.romaji);
    if (anime.title?.english) namesToReplace.add(anime.title.english);
    if (anime.title?.native) namesToReplace.add(anime.title.native);

    if (anime.synonyms && Array.isArray(anime.synonyms)) {
        anime.synonyms.forEach(s => {
            if (s && s.length > 1) namesToReplace.add(s);
        });
    }

    // Sort by length descending to replace longer names first
    const sortedNames = Array.from(namesToReplace).sort((a, b) => b.length - a.length);

    let result = description;
    sortedNames.forEach(name => {
        if (name === displayTitle || name === baseDisplayTitle) return;

        // Escape special characters for regex
        const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedName, 'gi');

        // Logic to avoid double naming (e.g. "Medalist Season 2 Season 2")
        // If the synonym is a "base" form and the text already has a season suffix after it,
        // we should replace it with the baseDisplayTitle, not the full displayTitle.

        const baseName = getBaseTitle(name);
        if (baseName !== name) {
            // It's a full name with season, replace with full displayTitle
            result = result.replace(regex, displayTitle);
        } else {
            // It's a base name, replace with baseDisplayTitle
            result = result.replace(regex, baseDisplayTitle);
        }
    });

    return result;
};

const sanitizeName = (n) => {
    if (!n || typeof n !== 'string') return n;
    // Remove all brackets, quotes, and punctuation except single spaces
    return n.replace(/[\[\]{}()【】!?,.:;'"\-_]/g, ' ').replace(/\s+/g, ' ').trim();
};

export const prepareDescriptionForTranslation = (description, anime) => {
    if (!description || !anime) return { text: description, placeholders: {} };

    // Collect all potential names to replace with placeholders
    const namesToReplace = new Set();
    const displayTitle = getDisplayTitle(anime, 'en'); // Get non-chinese version for English source
    const displayTitleZh = getDisplayTitle(anime, 'zh');

    const addName = (n) => {
        if (!n || n.length < 2) return;
        namesToReplace.add(n);

        const base = getBaseTitle(n);
        if (base && base.length > 2) namesToReplace.add(base);

        const sanitized = sanitizeName(n);
        if (sanitized && sanitized.length > 2) namesToReplace.add(sanitized);

        const sanitizedBase = sanitizeName(base);
        if (sanitizedBase && sanitizedBase.length > 2) namesToReplace.add(sanitizedBase);
    };

    if (anime.title?.romaji) addName(anime.title.romaji);
    if (anime.title?.english) addName(anime.title.english);
    if (anime.title?.native) addName(anime.title.native);
    if (displayTitle) addName(displayTitle);
    if (displayTitleZh) addName(displayTitleZh);

    if (anime.synonyms && Array.isArray(anime.synonyms)) {
        anime.synonyms.forEach(s => addName(s));
    }

    // Filter out very common short words if any
    const finalNames = Array.from(namesToReplace).filter(n => {
        if (!n || n.length < 3) return false;
        // Avoid replacing digits only
        if (/^\d+$/.test(n)) return false;
        return true;
    });

    const sortedNames = finalNames.sort((a, b) => b.length - a.length);
    let text = description;
    const placeholders = []; // Use array to maintain order

    sortedNames.forEach((name, index) => {
        const placeholder = `__TITLE_REF_${index}__`;
        // Use a more inclusive word boundary regex for different languages
        // but for placeholders we usually just want to match the string exactly
        const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedName, 'gi');

        if (regex.test(text)) {
            text = text.replace(regex, placeholder);
            placeholders.push(placeholder);
        }
    });

    return { text, placeholders };
};

export const finalizeDescriptionAfterTranslation = (translatedText, anime, lang) => {
    if (!translatedText || !anime) return translatedText;

    const displayTitle = getDisplayTitle(anime, lang);
    const baseDisplayTitle = getBaseTitle(displayTitle);
    let result = translatedText;

    // 1. Replace all placeholders back with the BASE display title
    // This avoids "Title Season 3 Season 3" duplication if the season was already in the text.
    // Example: "The third season of __TITLE__" -> "我推的孩子 的第三季"
    result = result.replace(/__TITLE_REF_\d+__/g, baseDisplayTitle);

    // 2. Perform a final pass with standardizeDescription to catch any synonymous titles 
    // that might have been produced by the translator or were already present.
    // This function also handles the base vs full logic intelligently.
    return standardizeDescription(result, anime, lang);
};
