import { defineConfig } from 'vite'
import { reactRouter } from "@react-router/dev/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [reactRouter()],
    resolve: {
        dedupe: ['react', 'react-dom'],
    },
    build: {
        chunkSizeWarningLimit: 1200,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (/[/\\](react|react-dom|scheduler)[/\\]/.test(id)) return;
                        if (id.includes('firebase')) return 'vendor-firebase';
                        if (id.includes('@mui') || id.includes('@emotion')) return 'vendor-mui';
                        if (id.includes('react-router')) return 'vendor-router';
                        if (id.includes('react-icons')) return 'vendor-icons';
                        if (id.includes('opencc-js')) return 'vendor-opencc';
                        if (id.includes('@reduxjs') || id.includes('react-redux')) return 'vendor-redux';
                        if (id.includes('axios') || id.includes('graphql-request')) return 'vendor-network';
                        return 'vendor-misc';
                    }
                },
            },
        },
    },
    server: {
        proxy: {
            '/anilist-proxy': {
                target: 'https://trace.moe',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/anilist-proxy/, '/anilist/'),
                secure: false,
            },
        },
    },
})
