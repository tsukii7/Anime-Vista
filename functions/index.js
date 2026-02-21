import express from "express";
import { onRequest } from "firebase-functions/v2/https";
import { createRequestHandler } from "@react-router/express";
import path from "path";
import { fileURLToPath } from "url";

// __dirname polyfill
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// create express app
const app = express();

// static file serving
app.use(
    express.static(path.resolve(__dirname, "./build/client"), {
        extensions: ["html"],
    })
);

// set SSR handler
const build = await import("./build/server/index.js");
app.use("/", (req, res, next) => {
    console.log("🔥 SSR received request:", req.originalUrl);
    return createRequestHandler({ build })(req, res, next);
});


// export as Firebase Cloud Function
export const ssr = onRequest(app);
