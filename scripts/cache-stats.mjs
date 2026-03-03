#!/usr/bin/env node
/**
 * 查看 L2 缓存统计（仅 SQLite，不包含运行中服务的 L1 命中率）。
 * 用法: node scripts/cache-stats.mjs
 * 若服务正在运行，更推荐直接请求 GET http://localhost:3000/api/cache-stats 获取完整统计（含命中率、L1/L2 等）。
 */
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'cache.sqlite');

function formatBytes(n) {
    if (n >= 1024 * 1024) return (n / 1024 / 1024).toFixed(2) + ' MB';
    if (n >= 1024) return (n / 1024).toFixed(2) + ' KB';
    return n + ' B';
}

try {
    const db = new Database(dbPath, { readonly: true });
    const now = Date.now();
    const valid = db.prepare('SELECT COUNT(*) as n FROM cache WHERE expires_at > ?').get(now);
    const total = db.prepare('SELECT COUNT(*) as n FROM cache').get();
    let sizeStr = '0 B';
    try {
        if (fs.existsSync(dbPath)) {
            sizeStr = formatBytes(fs.statSync(dbPath).size);
        }
    } catch (_) {}

    console.log('L2 (SQLite) 缓存信息');
    console.log('  路径:', dbPath);
    console.log('  文件大小:', sizeStr);
    console.log('  未过期条数:', valid?.n ?? 0);
    console.log('  总行数（含已过期）:', total?.n ?? 0);

    const sample = db.prepare('SELECT key, expires_at FROM cache WHERE expires_at > ? LIMIT 5').all(now);
    if (sample.length) {
        console.log('  示例 key（MD5）:', sample.map(r => r.key));
        console.log('  示例过期时间（毫秒时间戳）:', sample.map(r => r.expires_at));
    }
    db.close();
} catch (e) {
    if (e.code === 'SQLITE_CANTOPEN' || e.message?.includes('no such file')) {
        console.log('未找到缓存数据库:', dbPath);
        console.log('说明: 需先运行 npm run build && npm run preview，并在浏览器中产生 AniList 请求后才会生成 cache.sqlite。');
    } else {
        console.error(e);
    }
    process.exit(1);
}
