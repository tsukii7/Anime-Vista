import axios from 'axios';

let rateLimitRemaining = 90;
let rateLimitResetTime = Date.now() + 60000;
let requestGate = Promise.resolve();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const isServer = typeof window === 'undefined';

const anilistApi = axios.create({
    baseURL: isServer ? 'https://trace.moe/anilist' : '/anilist-proxy',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});


anilistApi.interceptors.request.use(async (config) => {
    const previousGate = requestGate;
    let releaseGate = () => {};
    requestGate = new Promise((resolve) => {
        releaseGate = resolve;
    });
    await previousGate.catch(() => {});
    try {
        // If remaining limit is dangerously low
        if (rateLimitRemaining <= 10) {
            const now = Date.now();
            const waitTime = rateLimitResetTime > now ? rateLimitResetTime - now : 60000;
            console.warn(`[AniList API] Rate limit dangerously close (${rateLimitRemaining} left). Delaying request for ${waitTime}ms...`);
            await delay(waitTime);
            // Reset assumptions
            rateLimitRemaining = 90;
            rateLimitResetTime = Date.now() + 60000;
        }
        return config;
    } finally {
        releaseGate();
    }
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
        // If the request was canceled, bypass global error handling
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }
        const status = error?.response?.status || null;
        const responseData = error?.response?.data;
        const responseText = typeof responseData === 'string' ? responseData : JSON.stringify(responseData || {});
        const hasEnableCookies = responseText.includes('Please enable cookies');
        const hasRayId = responseText.includes('Ray ID');
        if (status === 500 && hasEnableCookies && hasRayId && error?.config?.data) {
            try {
                return await axios.post('https://graphql.anilist.co', error.config.data, {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    signal: error.config.signal,
                });
            } catch (fallbackError) {
                void fallbackError;
            }
        }

        // Retrieve current language from localStorage (matches LanguageContext behavior)
        const isClient = typeof window !== 'undefined';
        const lang = isClient ? localStorage.getItem('app_language') || 'en' : 'en';

        if (error.response && error.response.status === 429) {
            const retryAfter = error.response.headers['retry-after'];
            const retrySeconds = retryAfter ? parseInt(retryAfter, 10) : 60;

            rateLimitRemaining = 0;
            rateLimitResetTime = Date.now() + (retrySeconds * 1000);

            error.isRateLimited = true;
            error.retryAfter = retrySeconds;

            if (lang === 'zh') {
                error.message = `请求过于频繁，请在 ${retrySeconds}s 后重试`;
            } else {
                error.message = `Too many requests. Please retry in ${retrySeconds}s`;
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
                    error.message = `请求过于频繁，请在 ${retrySeconds}s 后重试`;
                } else {
                    error.message = `Too many requests. Please retry in ${retrySeconds}s`;
                }
            } else {
                if (lang === 'zh') {
                    error.message = "网络请求失败，请检查连接";
                } else {
                    error.message = "Network Connectivity Error. Please check your connection.";
                }
            }
        }
        return Promise.reject(new Error(error.message || 'AniList API Request Failed'));
    }
);

export default anilistApi;
