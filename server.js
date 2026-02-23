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

    try {
        const response = await requestWithTimeout("https://trace.moe/anilist/");
        return res.json(response.data);
    } catch (error) {
        const responseText = typeof error?.response?.data === "string"
            ? error.response.data
            : JSON.stringify(error?.response?.data || {});
        const isCloudflareWorkerError = error?.response?.status === 500 &&
            responseText.includes("Please enable cookies") &&
            responseText.includes("Ray ID");

        if (isCloudflareWorkerError) {
            try {
                const fallback = await requestWithTimeout("https://graphql.anilist.co");
                return res.json(fallback.data);
            } catch (fallbackError) {
                return res
                    .status(fallbackError.response?.status || 500)
                    .json(fallbackError.response?.data || { error: fallbackError.message });
            }
        }

        return res
            .status(error.response?.status || 500)
            .json(error.response?.data || { error: error.message });
    }
});



app.use('*', createRequestHandler({
    build: await import('./build/server/index.js')
}));


app.listen(3000, () => {
    console.log('SSR server running at http://localhost:3000')
})

