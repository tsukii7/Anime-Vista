import express from "express";
import { onRequest } from "firebase-functions/v2/https";
import { createRequestHandler } from "@react-router/express";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

const bucket = admin.storage().bucket('anime-vista.appspot.com');
bucket.setCorsConfiguration([
    {
        maxAgeSeconds: 3600,
        method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
        origin: ['http://localhost:5173', 'https://anime-vista.web.app', 'https://anime-vista.firebaseapp.com'],
        responseHeader: ['Content-Type'],
    },
]).then(() => console.log('✅ Storage CORS configuration updated')).catch(err => console.error('❌ Failed to set Storage CORS:', err));

import axios from "axios";

// __dirname polyfill
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// create express app
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// static file serving
app.use(
    express.static(path.resolve(__dirname, "./build/client"), {
        extensions: ["html"],
    })
);

// Proxy for AniList API
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

// Avatar Upload Endpoint (Proxied to avoid CORS)
app.post("/upload-avatar", async (req, res) => {
    try {
        const { userId, base64Image } = req.body;
        if (!userId || !base64Image) {
            return res.status(400).json({ error: "Missing userId or base64Image" });
        }
        if (!/^[A-Za-z0-9_-]+$/.test(userId)) {
            return res.status(400).json({ error: "Invalid userId format" });
        }

        const authHeader = req.headers.authorization || "";
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const idToken = authHeader.slice("Bearer ".length);
        let decodedToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (_verifyErr) {
            return res.status(401).json({ error: "Invalid token" });
        }
        if (decodedToken?.uid !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        // Extract mime type and base64 data
        const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return res.status(400).json({ error: "Invalid base64 string" });
        }

        const type = matches[1];
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(type)) {
            return res.status(400).json({ error: "Invalid file type" });
        }

        const maxSizeBytes = 10 * 1024 * 1024;
        const estimatedSize = (matches[2].length * 3) / 4;
        if (estimatedSize > maxSizeBytes) {
            return res.status(400).json({ error: "File too large" });
        }
        const buffer = Buffer.from(matches[2], 'base64');

        const bucket = admin.storage().bucket('anime-vista.appspot.com');
        const file = bucket.file(`avatars/${userId}`);

        await file.save(buffer, {
            metadata: { contentType: type },
            public: true
        });

        // Construct the public URL (AniList/Firebase pattern)
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/avatars/${userId}`;
        res.json({ url: publicUrl });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: error.message });
    }
});

// set SSR handler
const build = await import("./build/server/index.js");
app.use("/", (req, res, next) => {
    if (req.path === "/anilist-proxy") return next(); // Handled above
    console.log("🔥 SSR received request:", req.originalUrl);
    return createRequestHandler({ build })(req, res, next);
});



// export as Firebase Cloud Function
export const ssr = onRequest(app);
