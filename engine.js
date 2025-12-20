document.addEventListener("DOMContentLoaded", async () => {

    const dashboard = document.getElementById("dashboardContent");
    const systemHealth = document.getElementById("systemHealth");
    const lastScan = document.getElementById("lastScan");
    const scanBtn = document.getElementById("scanBtn");
    const autoRefreshToggle = document.getElementById("autoRefresh");
    const globalText = document.getElementById("globalText");

    const btnProbe = document.getElementById("btnProbe");
    const customUrlInput = document.getElementById("customUrl");
    const probeResult = document.getElementById("probeResult");
    const probeHistoryList = document.getElementById("probeHistoryList");

    let appConfig = null;
    let autoRefreshInterval = null;

    const HISTORY_KEY = "kernel_pulse_probe_history";
    const MAX_HISTORY = 10;

    // Load config.json
    try {
        const res = await fetch("config.json");
        appConfig = await res.json();
        renderDashboard(appConfig, dashboard);
        runScan();
    } catch {
        dashboard.innerHTML =
            "<div style='color:red;padding:2rem;'>Failed to load config.json</div>";
    }

    // Manual Scan
    scanBtn.addEventListener("click", runScan);

    // Auto Refresh (30s)
    autoRefreshToggle.addEventListener("change", (e) => {
        if (e.target.checked) {
            runScan();
            autoRefreshInterval = setInterval(runScan, 30000);
        } else {
            clearInterval(autoRefreshInterval);
        }
    });

    // Quick Probe click
    btnProbe.addEventListener("click", runProbe);

    // ENTER key support
    customUrlInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            runProbe();
        }
    });

    // Load history on start
    renderProbeHistory();

    async function runProbe() {
        let url = customUrlInput.value.trim();
        if (!url) return;

        if (!url.startsWith("http")) {
            url = "https://" + url;
            customUrlInput.value = url;
        }

        probeResult.className = "probe-result loading";
        probeResult.innerText = "Checking...";
        probeResult.classList.remove("hidden");

        const result = await ping(url);

        if (result.up) {
            probeResult.className = "probe-result success";
            probeResult.innerText = `ONLINE • ${result.responseTime} ms`;
        } else {
            probeResult.className = "probe-result error";
            probeResult.innerText = "OFFLINE";
        }

        saveToHistory(url);
        renderProbeHistory();
    }

    async function runScan() {
        if (!appConfig) return;

        scanBtn.disabled = true;
        scanBtn.innerText = "SCANNING...";
        lastScan.innerText = new Date().toLocaleTimeString();

        let globalFail = false;

        for (const cat of appConfig.categories) {
            for (const svc of cat.services) {
                updateStatusUI(svc.id, "loading");
                const result = await ping(svc.url);
                updateStatusUI(svc.id, result.up ? "up" : "down", result);
                if (!result.up) globalFail = true;
            }
        }

        systemHealth.className = globalFail
            ? "pulse-status error"
            : "pulse-status";
        globalText.innerText = globalFail
            ? "SYSTEM WARNING"
            : "SYSTEM NORMAL";

        scanBtn.disabled = false;
        scanBtn.innerHTML = '<i class="fas fa-radar"></i> SCAN NETWORK';
    }

    async function ping(url) {
        try {
            const res = await fetch(`/api/ping?url=${encodeURIComponent(url)}`);
            return await res.json();
        } catch {
            return { up: false };
        }
    }

    // 🔥 HISTORY LOGIC (CLIENT SIDE)

    function saveToHistory(url) {
        let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

        // Remove duplicates
        history = history.filter(item => item !== url);

        // Add to top
        history.unshift(url);

        // Limit size
        if (history.length > MAX_HISTORY) {
            history.pop();
        }

        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }

    function renderProbeHistory() {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        probeHistoryList.innerHTML = "";

        history.forEach(url => {
            const li = document.createElement("li");
            li.innerText = url;
            li.style.cursor = "pointer";

            li.addEventListener("click", () => {
                customUrlInput.value = url;
                runProbe();
            });

            probeHistoryList.appendChild(li);
        });
    }

    // UI Rendering

    function renderDashboard(config, container) {
        container.innerHTML = "";
        config.categories.forEach(cat => {
            const title = document.createElement("div");
            title.className = "category-title";
            title.innerText = cat.name;
            container.appendChild(title);

            const grid = document.createElement("div");
            grid.className = "grid";

            cat.services.forEach(svc => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <div class="card-header">
                        <h3>${svc.name}</h3>
                        <div class="status-indicator loading" id="status-${svc.id}">
                            WAITING
                        </div>
                    </div>
                    <p>${svc.desc}</p>
                    <div class="response-time" id="msg-${svc.id}">
                        Ready
                    </div>
                `;
                grid.appendChild(card);
            });

            container.appendChild(grid);
        });
    }

    function updateStatusUI(id, state, data = {}) {
        const badge = document.getElementById(`status-${id}`);
        const msg = document.getElementById(`msg-${id}`);

        if (state === "loading") {
            badge.className = "status-indicator loading";
            badge.innerText = "CHECKING";
            msg.innerText = "Pinging...";
        }

        if (state === "up") {
            badge.className = "status-indicator up";
            badge.innerText = "ONLINE";
            msg.innerText = `Response: ${data.responseTime} ms`;
        }

        if (state === "down") {
            badge.className = "status-indicator down";
            badge.innerText = "OFFLINE";
            msg.innerText = "Unreachable";
        }
    }

});
