# AniList Cache (Server-side)

This project adds a **two-tier cache** for AniList GraphQL responses behind the Express endpoint `POST /anilist-proxy`:

- **L1 (Memory Map)**: fast hot cache, cleared on process restart
- **L2 (SQLite, cache.sqlite)**: persistent cache, survives restarts

The cache key is **MD5(query + variables)**. Only successful responses are stored.

---

## How to run (IMPORTANT)

The cache and endpoints below exist **only** when running the Express SSR server (`node server.js`):

```bash
npm run build
npm run preview
```

Do **not** use `npm run dev` to verify caching. `npm run dev` starts the Vite dev server and bypasses this cache.

---

## Endpoints

### Dashboard (Charts)

- **GET** `/api/cache-dashboard`

Shows a small dashboard (Chart.js via CDN) with:

- Hit rate, request counts, “saved AniList calls”, L1/L2 entry counts, DB size, uptime
- Doughnut chart: hits vs misses
- Bar chart: L1 hits vs L2 hits

### Stats (JSON)

- **GET** `/api/cache-stats`

Returns `summary` + `detail` + `description` (field explanations). Use this for automation and monitoring.

---

## How to verify caching works

1. Start Express (see “How to run”).
2. Browse the app and open the same anime details page multiple times.
3. Check `/api/cache-stats`:
   - `detail.hits` should increase on repeat requests
   - `detail.misses` should grow slower than total requests
   - `summary.hitRate` should trend upward during normal browsing

As a rule of thumb, a sustained **60–80%+** hit rate indicates the cache is doing real work.

---

## SQLite cache file (L2)

The database file is in the project root:

- `cache.sqlite` (plus `cache.sqlite-wal`, `cache.sqlite-shm`)

Quick check (requires `sqlite3` installed):

```bash
sqlite3 cache.sqlite
```

Example queries (`expires_at` is milliseconds):

```sql
SELECT COUNT(*) FROM cache WHERE expires_at > (strftime('%s','now') * 1000);
SELECT key, expires_at FROM cache WHERE expires_at > (strftime('%s','now') * 1000) LIMIT 20;
.quit
```

---

## CLI helper (L2-only)

If you only want to inspect the SQLite file (no server required):

```bash
node scripts/cache-stats.mjs
```

Note: this script shows **L2 only**. For full hit/miss stats and L1/L2 breakdown, use `/api/cache-stats`.

---

## TTL policy

| Category | L1 TTL | L2 TTL |
| -------- | ------ | ------ |
| Media details (single id) | 30 min | 24 h |
| Timeline / season (airingSchedule) | 15 min | 2 h |
| Trending / ranking (sort) | 15 min | 1 h |
| Search | 10 min | 30 min |
| Default | 10 min | 30 min |

Expired entries are cleaned every **10 minutes**.

---

## Security note

`/api/cache-stats` and `/api/cache-dashboard` are intended for admin/debug use. If you expose them publicly, consider protecting them with Nginx allowlist or simple authentication.
