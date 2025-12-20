export default async function handler(req, res) {
    const targetUrl = req.query.url;

    // Safety check
    if (!targetUrl) {
        return res.status(400).json({ up: false, error: "No URL provided" });
    }

    try {
        // Try connecting to the target
        const response = await fetch(targetUrl, {
            method: "GET",
            redirect: "manual",
            headers: {
                "User-Agent": "Kernel-Pulse-Monitor"
            }
        });

        // If we get ANY response → site is UP
        res.status(200).json({
            up: true,
            status: response.status
        });

    } catch (err) {
        // If fetch throws → site is DOWN
        res.status(200).json({
            up: false,
            error: "Unreachable"
        });
    }
}
