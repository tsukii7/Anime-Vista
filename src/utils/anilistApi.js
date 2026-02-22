import axios from 'axios';

let rateLimitRemaining = 90;
let rateLimitResetTime = Date.now() + 60000;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const anilistApi = axios.create({
    baseURL: '/anilist-proxy',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

anilistApi.interceptors.request.use(async (config) => {
    // If remaining limit is dangerously low
    if (rateLimitRemaining <= 2) {
        const now = Date.now();
        const waitTime = rateLimitResetTime > now ? rateLimitResetTime - now : 60000;
        console.warn(`[AniList API] Rate limit dangerously close (${rateLimitRemaining} left). Delaying request for ${waitTime}ms...`);
        await delay(waitTime);
        // Reset assumptions
        rateLimitRemaining = 90;
        rateLimitResetTime = Date.now() + 60000;
    }
    return config;
}, (error) => Promise.reject(error));

anilistApi.interceptors.response.use(
    (response) => {
        const remaining = response.headers['x-ratelimit-remaining'];
        if (remaining !== undefined) {
            rateLimitRemaining = parseInt(remaining, 10);
            if (rateLimitRemaining >= 89) {
                rateLimitResetTime = Date.now() + 60000;
            }
        }
        return response;
    },
    async (error) => {
        // Retrieve current language from localStorage (matches LanguageContext behavior)
        const lang = localStorage.getItem('app_language') || 'en';

        if (error.response && error.response.status === 429) {
            const retryAfter = error.response.headers['retry-after'];
            const retrySeconds = retryAfter ? parseInt(retryAfter, 10) : 60;

            rateLimitRemaining = 0;
            rateLimitResetTime = Date.now() + (retrySeconds * 1000);

            error.isRateLimited = true;
            error.retryAfter = retrySeconds;

            if (lang === 'zh') {
                error.message = `请求过于频繁，稍等一会再试吧 (${retrySeconds}s)`;
            } else {
                error.message = `Too many requests. Please wait a moment and try again (${retrySeconds}s)`;
            }
        } else if (error.code === 'ECONNABORTED' || (!error.response && error.message === 'Network Error')) {
            // Anilist returns a 429 status code but strips CORS headers, causing Axios to see it purely as a Network Error. 
            // If the browser is online, we can safely deduce it's an API limit / block rather than a disconnected Wi-Fi.
            if (typeof navigator !== 'undefined' && navigator.onLine) {
                const retrySeconds = 60;
                rateLimitRemaining = 0;
                rateLimitResetTime = Date.now() + (retrySeconds * 1000);

                error.isRateLimited = true;
                error.retryAfter = retrySeconds;

                if (lang === 'zh') {
                    error.message = "请求过于频繁，稍等一会再试吧";
                } else {
                    error.message = "Too many requests. Please wait a moment and try again.";
                }
            } else {
                if (lang === 'zh') {
                    error.message = "网络请求失败，请检查连接";
                } else {
                    error.message = "Network Connectivity Error. Please check your connection.";
                }
            }
        }
        return Promise.reject(new Error(error.message));
    }
);

export default anilistApi;
