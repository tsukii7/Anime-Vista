import Database from 'better-sqlite3';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Two-tier cache for AniList API responses: L1 in-memory Map, L2 SQLite.
 * Cache key = MD5(query + variables). Only successful response bodies are cached.
 */
export class AnimeCache {
    constructor(dbPath = path.join(__dirname, '..', 'cache.sqlite')) {
        this.dbPath = dbPath;
        this.startedAt = Date.now();
        this.memCache = new Map(); // L1: key -> { value, expiresAt }
        this.stats = { hits: 0, l1Hits: 0, l2Hits: 0, misses: 0 };
        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL');
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS cache (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        expires_at INTEGER NOT NULL
      )
    `);
        this.cleanupInterval = setInterval(() => this.cleanup(), 10 * 60 * 1000);
    }

    makeKey(query, variables) {
        return crypto
            .createHash('md5')
            .update(JSON.stringify({ query, variables }))
            .digest('hex');
    }

    get(key) {
        const now = Date.now();
        const memEntry = this.memCache.get(key);
        if (memEntry && memEntry.expiresAt > now) {
            this.stats.hits += 1;
            this.stats.l1Hits += 1;
            return memEntry.value;
        }
        if (memEntry) {
            this.memCache.delete(key);
        }

        const row = this.db.prepare('SELECT value, expires_at FROM cache WHERE key = ? AND expires_at > ?').get(key, now);
        if (row) {
            this.stats.hits += 1;
            this.stats.l2Hits += 1;
            return JSON.parse(row.value);
        }
        this.stats.misses += 1;
        return null;
    }

    set(key, value, memTtlMs, dbTtlMs) {
        const now = Date.now();
        const valueStr = JSON.stringify(value);

        this.memCache.set(key, {
            value,
            expiresAt: now + memTtlMs,
        });

        const expiresAt = now + dbTtlMs;
        this.db.prepare(
            'INSERT OR REPLACE INTO cache (key, value, expires_at) VALUES (?, ?, ?)'
        ).run(key, valueStr, expiresAt);
    }

    cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.memCache.entries()) {
            if (entry.expiresAt <= now) {
                this.memCache.delete(key);
            }
        }
        this.db.prepare('DELETE FROM cache WHERE expires_at <= ?').run(now);
    }

    getStats() {
        const now = Date.now();
        const total = this.stats.hits + this.stats.misses;
        const dbCount = this.db.prepare('SELECT COUNT(*) as n FROM cache WHERE expires_at > ?').get(now);
        let dbSizeBytes = 0;
        try {
            if (fs.existsSync(this.dbPath)) {
                dbSizeBytes = fs.statSync(this.dbPath).size;
            }
        } catch {
            // ignore
        }
        const formatBytes = (n) => {
            if (n >= 1024 * 1024) return (n / 1024 / 1024).toFixed(2) + ' MB';
            if (n >= 1024) return (n / 1024).toFixed(2) + ' KB';
            return n + ' B';
        };
        const uptimeMs = now - this.startedAt;
        const uptimeStr = uptimeMs >= 3600000
            ? (uptimeMs / 3600000).toFixed(1) + ' h'
            : uptimeMs >= 60000
                ? (uptimeMs / 60000).toFixed(1) + ' min'
                : (uptimeMs / 1000).toFixed(0) + ' s';

        return {
            summary: {
                hitRate: total > 0 ? (this.stats.hits / total * 100).toFixed(1) + '%' : '0%',
                totalRequests: total,
                savedAniListCalls: this.stats.hits,
                cacheTier: {
                    l1: { hits: this.stats.l1Hits, entries: this.memCache.size },
                    l2: { hits: this.stats.l2Hits, entries: dbCount?.n ?? 0 },
                },
            },
            detail: {
                hits: this.stats.hits,
                l1Hits: this.stats.l1Hits,
                l2Hits: this.stats.l2Hits,
                misses: this.stats.misses,
                totalRequests: total,
                hitRate: total > 0 ? (this.stats.hits / total * 100).toFixed(1) + '%' : '0%',
                memEntries: this.memCache.size,
                dbEntries: dbCount?.n ?? 0,
                dbSizeBytes,
                dbSizeHuman: formatBytes(dbSizeBytes),
                startedAt: new Date(this.startedAt).toISOString(),
                uptime: uptimeStr,
                cleanupIntervalMinutes: 10,
            },
            description: {
                hits: '命中总次数（未请求 AniList）',
                l1Hits: 'L1 内存命中次数',
                l2Hits: 'L2 SQLite 命中次数',
                misses: '未命中次数（已请求 AniList）',
                totalRequests: '总请求数（hits + misses）',
                hitRate: '命中率',
                memEntries: 'L1 当前缓存条数',
                dbEntries: 'L2 当前未过期条数',
                dbSizeBytes: 'L2 数据库文件大小（字节）',
                dbSizeHuman: 'L2 文件大小（可读）',
                startedAt: '本次进程启动时间',
                uptime: '本次进程运行时长',
                cleanupIntervalMinutes: '过期条目清理间隔（分钟）',
            },
        };
    }

    close() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.db.close();
    }
}
