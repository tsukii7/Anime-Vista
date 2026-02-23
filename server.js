import express from 'express'
import { createRequestHandler } from '@react-router/express'
import { fileURLToPath } from 'url'
import path from 'path'

import axios from 'axios'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.use(
    express.static(path.resolve(__dirname, 'build/client'), {
        extensions: ['html'],
    })
)

app.post("/anilist-proxy", async (req, res) => {
    const body = req.body;
    const requestWithTimeout = (url) => axios.post(url, body, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        timeout: 30000,
    });
    const endpoints = [
        "https://trace.moe/anilist/",
        "https://graphql.anilist.co",
    ];

    let lastError = null;
    for (const endpoint of endpoints) {
        try {
            const response = await requestWithTimeout(endpoint);
            return res.json(response.data);
        } catch (error) {
            lastError = error;
            // If client request is invalid (4xx except 429), don't keep retrying endpoints.
            const status = error?.response?.status || 500;
            if (status >= 400 && status < 500 && status !== 429) {
                break;
            }
        }
    }

    return res
        .status(lastError?.response?.status || 500)
        .json(lastError?.response?.data || { error: lastError?.message || "AniList proxy failed" });
});



app.use('*', createRequestHandler({
    build: await import('./build/server/index.js')
}));


app.listen(3000, () => {
    console.log('SSR server running at http://localhost:3000')
})

