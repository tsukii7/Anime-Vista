import express from 'express'
import { createRequestHandler } from '@react-router/express'
import { fileURLToPath } from 'url'
import path from 'path'

import axios from 'axios'
import { AnimeCache } from './server/cache.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

const cache = new AnimeCache()

/** GET /api/cache-stats — 仅在使用 node server.js（npm run preview / npm run start）时可用，npm run dev 无此接口。 */
app.get('/api/cache-stats', (_req, res) => {
    try {
        res.json(cache.getStats())
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

/** GET /api/cache-dashboard — 缓存统计图表分析页（需先运行 npm run preview / start） */
app.get('/api/cache-dashboard', (_req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.send(cacheDashboardHtml())
})

function cacheDashboardHtml() {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AniList 缓存分析</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, "Segoe UI", sans-serif; margin: 0; padding: 20px; background: #f5f0fa; color: #1d1b20; }
    h1 { font-size: 1.5rem; margin-bottom: 8px; }
    .sub { color: #49454f; font-size: 0.875rem; margin-bottom: 20px; }
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px; }
    .card { background: #fff; border-radius: 12px; padding: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
    .card .label { font-size: 0.75rem; color: #49454f; margin-bottom: 4px; }
    .card .value { font-size: 1.25rem; font-weight: 600; color: #65558f; }
    .charts { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 900px; }
    .chart-wrap { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
    .chart-wrap h2 { font-size: 0.95rem; margin: 0 0 16px 0; color: #49454f; }
    .chart-container { position: relative; height: 220px; }
    .error { color: #b3261e; padding: 12px; }
    .refresh { margin-top: 16px; }
    a { color: #65558f; }
  </style>
</head>
<body>
  <h1>AniList 缓存分析</h1>
  <p class="sub">数据来自 /api/cache-stats，每 30 秒自动刷新</p>
  <div id="root">
    <p>加载中…</p>
  </div>
  <div class="refresh"><a href="/api/cache-dashboard">刷新页面</a> · <a href="/api/cache-stats">原始 JSON</a></div>

  <script>
    function render(d) {
      const detail = d.detail || {};
      const summary = d.summary || {};
      const total = detail.totalRequests || 0;
      const hits = detail.hits || 0;
      const misses = detail.misses || 0;
      const l1 = detail.l1Hits ?? summary.cacheTier?.l1?.hits ?? 0;
      const l2 = detail.l2Hits ?? summary.cacheTier?.l2?.hits ?? 0;

      var html = '<div class="cards">' +
        '<div class="card"><div class="label">命中率</div><div class="value">' + (detail.hitRate || summary.hitRate || '0%') + '</div></div>' +
        '<div class="card"><div class="label">总请求数</div><div class="value">' + total + '</div></div>' +
        '<div class="card"><div class="label">节省的 API 调用</div><div class="value">' + (summary.savedAniListCalls ?? hits) + '</div></div>' +
        '<div class="card"><div class="label">L1 条数</div><div class="value">' + (detail.memEntries ?? 0) + '</div></div>' +
        '<div class="card"><div class="label">L2 条数</div><div class="value">' + (detail.dbEntries ?? 0) + '</div></div>' +
        '<div class="card"><div class="label">L2 大小</div><div class="value">' + (detail.dbSizeHuman || '0 B') + '</div></div>' +
        '<div class="card"><div class="label">运行时长</div><div class="value">' + (detail.uptime || '-') + '</div></div>' +
        '</div><div class="charts">' +
        '<div class="chart-wrap"><h2>命中 vs 未命中</h2><div class="chart-container"><canvas id="chartHit"></canvas></div></div>' +
        '<div class="chart-wrap"><h2>L1 内存 vs L2 磁盘命中</h2><div class="chart-container"><canvas id="chartTier"></canvas></div></div>' +
        '</div>';
      document.getElementById('root').innerHTML = html;

      if (typeof Chart !== 'undefined') {
        new Chart(document.getElementById('chartHit'), {
          type: 'doughnut',
          data: {
            labels: ['命中', '未命中'],
            datasets: [{ data: [hits, misses], backgroundColor: ['#65558f', '#cac4d0'] }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
        new Chart(document.getElementById('chartTier'), {
          type: 'bar',
          data: {
            labels: ['L1 内存', 'L2 SQLite'],
            datasets: [{ label: '命中次数', data: [l1, l2], backgroundColor: ['#7f67a3', '#9a8bb8'] }]
          },
          options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }
        });
      }
    }

    function load() {
      fetch('/api/cache-stats')
        .then(r => r.json())
        .then(render)
        .catch(e => { document.getElementById('root').innerHTML = '<p class="error">加载失败: ' + e.message + '</p>'; });
    }
    load();
    setInterval(load, 30000);
  </script>
</body>
</html>`
}

app.use(
    express.static(path.resolve(__dirname, 'build/client'), {
        extensions: ['html'],
    })
)

/**
 * Classify request by query shape and return TTL: { memMs, dbMs }.
 * - Media(id: with single ID -> anime details (long)
 * - sort: TRENDING -> trending/ranking (medium)
 * - search: -> search results (short)
 * - airingSchedule -> season/timeline (medium)
 * - Default -> short
 */
function classifyTtl(query, variables) {
    const q = typeof query === 'string' ? query : ''
    const v = variables || {}

    // Anime details by ID: single Media(id: ...)
    if (/Media\s*\(\s*id\s*:/.test(q) && typeof v.id === 'number') {
        return { memMs: 30 * 60 * 1000, dbMs: 24 * 60 * 60 * 1000 }
    }
    // Timeline / season with airing schedule
    if (/airingSchedule/.test(q)) {
        return { memMs: 15 * 60 * 1000, dbMs: 2 * 60 * 60 * 1000 }
    }
    // Trending / ranking (sort TRENDING_DESC etc.)
    if (/sort:\s*\[?\s*TRENDING|TRENDING_DESC|POPULARITY|SCORE/.test(q)) {
        return { memMs: 15 * 60 * 1000, dbMs: 60 * 60 * 1000 }
    }
    // Search (has search variable)
    if (/search\s*:/.test(q) || v.search != null) {
        return { memMs: 10 * 60 * 1000, dbMs: 30 * 60 * 1000 }
    }
    // Default: short
    return { memMs: 10 * 60 * 1000, dbMs: 30 * 60 * 1000 }
}

async function fetchFromAniList(body) {
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
            return response.data;
        } catch (error) {
            lastError = error;
            const status = error?.response?.status || 500;
            if (status >= 400 && status < 500 && status !== 429) {
                break;
            }
        }
    }
    throw lastError || new Error("AniList proxy failed");
}

app.post("/anilist-proxy", async (req, res) => {
    const body = req.body;
    const { query, variables } = body;

    if (query && variables !== undefined) {
        const key = cache.makeKey(query, variables);
        const ttl = classifyTtl(query, variables);

        const cached = cache.get(key);
        if (cached) {
            return res.json(cached);
        }

        try {
            const data = await fetchFromAniList(body);
            cache.set(key, data, ttl.memMs, ttl.dbMs);
            return res.json(data);
        } catch (error) {
            const status = error?.response?.status || 500;
            return res
                .status(status)
                .json(error?.response?.data || { error: error?.message || "AniList proxy failed" });
        }
    }

    // No query: pass through without cache
    try {
        const data = await fetchFromAniList(body);
        return res.json(data);
    } catch (error) {
        const status = error?.response?.status || 500;
        return res
            .status(status)
            .json(error?.response?.data || { error: error?.message || "AniList proxy failed" });
    }
});



app.use('*', createRequestHandler({
    build: await import('./build/server/index.js')
}));


app.listen(3000, () => {
    console.log('SSR server running at http://localhost:3000')
})

