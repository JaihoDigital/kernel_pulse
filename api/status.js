export default async function handler(req, res) {
    res.setHeader("Content-Type", "application/json");

    res.json({
        name: "Kernel Pulse",
        status: "operational",
        updated: new Date().toISOString()
    });
}
