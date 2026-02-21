import express from 'express'
import { createRequestHandler } from '@react-router/express'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(
    express.static(path.resolve(__dirname, 'build/client'), {
        extensions: ['html'],
    })
)

app.use('*', createRequestHandler({
    build: await import('./build/server/index.js')
}));

app.listen(3000, () => {
    console.log('SSR server running at http://localhost:3000')
})

