import { defineConfig } from 'vite'
import { reactRouter } from "@react-router/dev/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [reactRouter()],
    resolve: {
        dedupe: ['react', 'react-dom'],
    },
    server: {
        proxy: {
            '/anilist-proxy': {
                target: 'https://trace.moe',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/anilist-proxy/, '/anilist/'),
            },
        },
    },
})
