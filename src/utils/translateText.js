import axios from 'axios';

const CACHE_KEY = 'anime_translations_cache';
const GOOGLE_TRANSLATE_API = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=';

function getCache() {
    try {
        if (typeof window === 'undefined') return {};
        return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    } catch {
        return {};
    }
}

function setCache(key, value) {
    try {
        if (typeof window === 'undefined') return;
        const cache = getCache();
        cache[key] = value;
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
        // Ignore localStorage quota errors
    }
}

/**
 * Dictionary for common AniList tags to ensure accurate translations
 */
const TAG_DICTIONARY = {
    'Urban': '都市',
    'Mythology': '神话',
    'Magic': '魔法',
    'Foreign': '异国',
    'Urban Fantasy': '都市幻想',
    'Iyashikei': '治愈系',
    'Gore': '血腥',
    'Survival': '生存',
    'Post-Apocalyptic': '末日',
    'Time Manipulation': '时间操作',
    'Coming of Age': '成长',
    'Female Protagonist': '女性主角',
    'Male Protagonist': '男性主角',
    'Demons': '恶魔',
    'Shounen': '少年',
    'Swordplay': '剑术',
    'Vampire': '吸血鬼',
    'Super Power': '超能力',
    'Afterlife': '死后世界',
    'Ghost': '幽灵',
    'War': '战争',
    'Ensemble Cast': '群像剧',
    'Cultivation': '养成'
};

/**
 * Translates English text to Chinese using unofficial Google Translate API
 * Contains internal localStorage caching to prevent redundant requests
 */
export async function translateToChinese(text) {
    if (!text || typeof text !== 'string') return text;

    let sourceText = '';
    let textToTranslate = text;
    // Extract "(Source: ...)" or "[Written by MAL Rewrite]" to preserve it
    const sourceRegex = /\s*(?:\(Source:.*?\)|\[Written by MAL Rewrite\])/i;
    const match = text.match(sourceRegex);
    if (match) {
        sourceText = match[0].trim();
        textToTranslate = text.replace(sourceRegex, '').trim();
    }

    // Check hardcoded dictionary first
    if (TAG_DICTIONARY[textToTranslate]) {
        return TAG_DICTIONARY[textToTranslate];
    }

    // Check cache first
    const cache = getCache();
    if (cache[textToTranslate]) {
        return cache[textToTranslate] + (sourceText ? `\n\n(Source: ${sourceText.replace(/^\(?(Source:\s*)?/i, '').replace(/\)?$/, '')})` : '');
    }

    try {
        const response = await axios.get(`${GOOGLE_TRANSLATE_API}${encodeURIComponent(textToTranslate)}`);

        // Google Translate unofficial API returns nested array structure
        // e.g: [[["你好","Hello",null,null,1]],null,"en",null,null,null,1,[],[["en"],null,[1],["en"]]]
        if (response.data && response.data[0]) {
            const translatedArr = response.data[0];
            let fullTranslation = '';
            for (let i = 0; i < translatedArr.length; i++) {
                if (translatedArr[i][0]) {
                    fullTranslation += translatedArr[i][0];
                }
            }

            if (fullTranslation.trim().length > 0) {
                setCache(textToTranslate, fullTranslation);
                return fullTranslation + (sourceText ? `\n\n(Source: ${sourceText.replace(/^\(?(Source:\s*)?/i, '').replace(/\)?$/, '')})` : '');
            }
        }
        return text; // Fallback
    } catch (error) {
        console.warn('API Translation failed, falling back to original text', error);
        return text;
    }
}
