// /api/json.js

const RATE_LIMIT = 60; // requests
const WINDOW_MS = 60 * 1000; // per minute

const rateMap = new Map();

export default async function handler(req, res) {
    const url = req.query.url || "https://kernel-pulse.vercel.app";
    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket?.remoteAddress ||
        "unknown";

    // -----------------------------
    // Rate limiting (per IP)
    // -----------------------------
    const now = Date.now();
    const record = rateMap.get(ip) || [];
    const recent = record.filter(ts => now - ts < WINDOW_MS);

    if (recent.length >= RATE_LIMIT) {
        return res.status(429).json({
            error: "rate_limit_exceeded",
            message: "Too many requests. Please slow down."
        });
    }

    recent.push(now);
    rateMap.set(ip, recent);

    // -----------------------------
    // SSRF protection
    // -----------------------------
    if (
        url.includes("localhost") ||
        url.includes("127.0.0.1") ||
        url.includes("0.0.0.0") ||
        /^http:\/\/(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1]))/.test(url)
    ) {
        return res.status(403).json({
            error: "blocked_target",
            message: "Private or local addresses are not allowed"
        });
    }

    // -----------------------------
    // Timeout setup (5s)
    // -----------------------------
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const start = Date.now();

    try {
        const response = await fetch(url, {
            method: "GET",
            redirect: "manual",
            signal: controller.signal,
            headers: {
                "User-Agent": "Kernel-Pulse-API"
            }
        });

        clearTimeout(timeout);

        const ms = Date.now() - start;

        return res.status(200).json({
            service: "Kernel Pulse",
            target: url,
            status: "online",
            up: true,
            responseTimeMs: ms,
            checkedAt: new Date().toISOString(),
            source: "vercel-serverless"
        });

    } catch (err) {
        clearTimeout(timeout);

        return res.status(200).json({
            service: "Kernel Pulse",
            target: url,
            status: "offline",
            up: false,
            responseTimeMs: null,
            checkedAt: new Date().toISOString(),
            source: "vercel-serverless"
        });
    }
}
