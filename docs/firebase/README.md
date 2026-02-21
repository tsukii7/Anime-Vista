> 🌐 View in Chinese: [简体中文](./README.zh-CN.md)

## 🌐 Server-Side Rendering (SSR)

Server-Side Rendering (SSR) refers to rendering React components into HTML strings on the server and returning them to
the browser. This approach avoids client-side white screens, improves initial page load speed, and enhances SEO
performance.

This project leverages SSR support built into React Router v7, combined with Express to perform route-level HTML
rendering. The build process uses the `react-router build` command to generate both client and server bundles:

- [`react-router.config.js`](../../react-router.config.js): Configures SSR build mode, entry files, and output paths.
- [`vite.config.js`](../../vite.config.js): Integrates the `@react-router/dev/vite` plugin to assist in generating both
  client and server outputs.
- [`package.json`](../../package.json): The `npm run build` command performs:
    - `react-router build`: Executes SSR build.
    - `node scripts/copySSR.mjs`: Copies SSR output to the Firebase Cloud Functions deployment directory.

After the build, two key directories are created:

- `.react-router/`: Build cache containing intermediate artifacts.
- `build/`: Final build output
    - `build/client/`: Static assets for the browser.
    - `build/server/`: Server-side entry module for SSR, including `index.js` for handling route requests.

The built `build/server/index.js` is automatically copied to Firebase Cloud Functions deployment path
`functions/build/server/` via [`scripts/copySSR.mjs`](../../scripts/copySSR.mjs), enabling SSR support on the hosting
platform.

## ☁️ Firebase Hosting Deployment (firebase deploy)

The project uses Firebase for unified hosting and SSR backend deployment. The complete deployment process is as follows:

First, copy the `dependencies` section from the root `package.json` into `functions/package.json`, while preserving the
required deployment dependencies: `firebase-admin` and `firebase-functions`:

```json
"dependencies": {
"firebase-admin": "^12.6.0",
"firebase-functions": "^6.3.2",
...
}
```

Then execute the following commands from the root directory:

```bash
npm run build         # Build both client and server outputs, and copy them to the Functions deployment directory
cd functions
npm install           # Install dependencies required for Cloud Functions (mandatory)
cd ..
firebase deploy       # Deploy to Firebase Hosting + Cloud Functions
```

### Why need a separate `npm install`

Firebase Functions runs as a separate subproject with its own dependencies (e.g., `express`, `@react-router/express`)
defined in `functions/package.json`.

After copying the build outputs, you must run `npm install` in the `functions/` directory to ensure all required modules
are available for deployment. Otherwise, errors like “missing modules” or “failed to load SSR handler” may occur.

### 🔍 `firebase deploy` workflow

`firebase deploy` is essentially a wrapper around several Google Cloud services:

```text
Project Code (React + Express)
       ↓
npm run build                      # Build frontend + SSR modules using React Router
       ↓
Firebase CLI                      # Submits build outputs and validates configuration
       ↓
Cloud Functions (auto-hosted via Cloud Run)  # Deploys SSR service as a container on Google Cloud
       ↓
Google Cloud Platform             # Hosting environment that listens for HTTP requests and renders HTML
```

For SSR, Firebase deploys the SSR handler from `functions/index.js` into a Cloud Run container (instead of a traditional
Cloud Functions environment). This supports long-lived processes listening, enabling full-site
server-side rendering.

### 🔃 Local SSR vs. Production Deployment

To support both local development and production SSR, the project maintains two SSR entry points:

- `functions/build/server/index.js`: Copied from `build/server/index.js`, used for Firebase SSR deployment.
- [`server.js`](../../server.js): Used for local SSR testing, not deployed. You can run it directly with `npm start`.

In [`package.json`](../../package.json), the command is defined as:

```json
"start": "node server.js"
```

[`server.js`](../../server.js) loads the local `build/server/index.js` output and starts an Express-based SSR server
listening at http://localhost:3000.

The logic is nearly identical between the two; the key difference is that `server.js` listens locally, while
`functions/build/server/index.js` is hosted by Firebase.

### 📁 Deployment-Related Config Files

- [`firebase.json`](../../firebase.json): Defines hosting directory (`build/client/`) and rewrite rules (e.g., routing
  all requests to the SSR entry).
- [`.firebaserc`](../../.firebaserc): Records the current Firebase project ID and alias for use by the CLI.
- [`functions/index.js`](../../functions/index.js): Entry point for the SSR service deployed to Cloud Functions; it
  imports the route handler from `build/server/index.js`.
- [`functions/package.json`](../../functions/package.json): Declares dependencies and runtime settings (Node.js version)
  for the Cloud Functions environment.

Once successfully deployed, the project can be accessed via the Firebase hosting domain: https://anime-vista.web.app/

> 🔐 If you encounter a `403 Forbidden` error on first visit, make sure anonymous access to the SSR function is enabled
> via the Google Cloud Console or `gcloud`.
