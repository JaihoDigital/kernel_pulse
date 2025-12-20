const RATE_LIMIT = 60;
const WINDOW_MS = 60 * 1000;

const rateMap = new Map();
const statusMap = new Map(); // store last offline time

export default async function handler(req, res) {
    const url = req.query.url;
    const ip = req.headers["x-forwarded-for"] || "unknown";

    if (!url) {
        return res.status(400).json({ up: false, error: "No URL" });
    }

    // SSRF protection
    if (
        url.includes("localhost") ||
        url.includes("127.0.0.1") ||
        url.includes("0.0.0.0") ||
        url.match(/^(http:\/\/)?(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1]))/)
    ) {
        return res.status(403).json({ up: false, error: "Blocked URL" });
    }

    // Rate limit
    const now = Date.now();
    const record = rateMap.get(ip) || [];
    const recent = record.filter(t => now - t < WINDOW_MS);
    if (recent.length >= RATE_LIMIT) {
        return res.status(429).json({ up: false, error: "Rate limit exceeded" });
    }
    recent.push(now);
    rateMap.set(ip, recent);

    // Timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const start = Date.now();

    try {
        const response = await fetch(url, {
            method: "GET",
            redirect: "manual",
            signal: controller.signal,
            headers: { "User-Agent": "Kernel-Pulse" }
        });

        clearTimeout(timeout);

        const ms = Date.now() - start;

        statusMap.set(url, { lastChecked: now });

        return res.status(200).json({
            up: true,
            responseTime: ms,
            status: response.status
        });

    } catch (err) {
        clearTimeout(timeout);

        const prev = statusMap.get(url) || {};
        statusMap.set(url, {
            lastChecked: now,
            lastOffline: now
        });

        return res.status(200).json({
            up: false,
            lastOffline: prev.lastOffline || now
        });
    }
}
