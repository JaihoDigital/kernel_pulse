document.addEventListener('DOMContentLoaded', async () => {
    // ... Existing Variables ...
    const dashboard = document.getElementById('dashboardContent');
    const systemHealth = document.getElementById('systemHealth');
    const lastScan = document.getElementById('lastScan');
    const scanBtn = document.getElementById('scanBtn');
    const autoRefreshToggle = document.getElementById('autoRefresh');
    const globalText = document.getElementById('globalText');
    
    // NEW Variables for Probe
    const btnProbe = document.getElementById('btnProbe');
    const customUrlInput = document.getElementById('customUrl');
    const probeResult = document.getElementById('probeResult');

    let appConfig = null;
    let autoRefreshInterval = null;

    // 1. Load Config & Init
    try {
        const configRes = await fetch('config.json');
        appConfig = await configRes.json();
        renderDashboard(appConfig, dashboard);
        runScan(); 
    } catch (e) {
        dashboard.innerHTML = `<div style="color:red; text-align:center; padding:2rem;">KERNEL ERROR: Could not load config.json</div>`;
    }

    // 2. Existing Listeners
    scanBtn.addEventListener('click', runScan);
    autoRefreshToggle.addEventListener('change', (e) => {
        if(e.target.checked) {
            runScan();
            autoRefreshInterval = setInterval(runScan, 30000);
        } else {
            clearInterval(autoRefreshInterval);
        }
    });

    // 3. NEW: Custom Probe Listener
    btnProbe.addEventListener('click', async () => {
        let url = customUrlInput.value.trim();
        if (!url) return;

        // Auto-add https if missing
        if (!url.startsWith('http')) {
            url = 'https://' + url;
            customUrlInput.value = url; // Update UI
        }

        // Show Loading
        probeResult.className = 'probe-result loading';
        probeResult.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Pinging target...';
        probeResult.classList.remove('hidden');

        // Check Logic
        const isUp = await checkConnectivity(url);

        // Show Result
        if (isUp) {
            probeResult.className = 'probe-result success';
            probeResult.innerHTML = `<i class="fas fa-check-circle"></i> TARGET ONLINE: ${url} is reachable.`;
        } else {
            probeResult.className = 'probe-result error';
            probeResult.innerHTML = `<i class="fas fa-times-circle"></i> TARGET UNREACHABLE: Could not connect to host.`;
        }
    });

    // Allow "Enter" key in input
    customUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') btnProbe.click();
    });

    // --- CORE LOGIC (Same as before) ---

    async function runScan() {
        if (!appConfig) return;
        
        scanBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> SCANNING...';
        scanBtn.disabled = true;
        scanBtn.style.opacity = "0.7";
        
        const now = new Date();
        lastScan.innerText = now.toLocaleTimeString();

        const services = appConfig.categories.flatMap(cat => cat.services);
        let globalFail = false;

        const checks = services.map(async (svc) => {
            updateStatusUI(svc.id, 'loading');
            const isUp = await checkConnectivity(svc.url);
            updateStatusUI(svc.id, isUp ? 'up' : 'down');
            if (!isUp) globalFail = true;
        });

        await Promise.all(checks);

        if (globalFail) {
            systemHealth.className = 'pulse-status error';
            globalText.innerText = 'SYSTEM WARNING';
        } else {
            systemHealth.className = 'pulse-status';
            globalText.innerText = 'SYSTEM NORMAL';
        }

        scanBtn.innerHTML = '<i class="fas fa-radar"></i> SCAN NETWORK';
        scanBtn.disabled = false;
        scanBtn.style.opacity = "1";
    }

    /*async function checkConnectivity(url) {
    try {
        const res = await fetch(
            `/api/ping?url=${encodeURIComponent(url)}`
        );
        const data = await res.json();
        return data.up;
    } catch (e) {
        return false;
    }
}*/

async function checkConnectivity(url) {
    const res = await fetch(`/api/ping?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    return data;
}

const result = await checkConnectivity(svc.url);
updateStatusUI(svc.id, result.up ? "up" : "down", result);



    function renderDashboard(config, container) {
        container.innerHTML = '';
        config.categories.forEach(cat => {
            const title = document.createElement('div');
            title.className = 'category-title';
            title.innerText = cat.name;
            container.appendChild(title);
            
            const grid = document.createElement('div');
            grid.className = 'grid';
            
            cat.services.forEach(svc => {
                const card = document.createElement('div');
                card.className = 'card';
                card.id = `card-${svc.id}`;
                card.onclick = () => window.open(svc.url, '_blank');
                card.style.cursor = 'pointer';
                
                card.innerHTML = `
                    <div class="card-header">
                        <h3>${svc.name}</h3>
                        <div class="status-indicator loading" id="status-${svc.id}">WAITING</div>
                    </div>
                    <p>${svc.desc}</p>
                    <div class="response-time" id="msg-${svc.id}">Ready to scan</div>
                `;
                grid.appendChild(card);
            });
            container.appendChild(grid);
        });
    }

    function updateStatusUI(id, state, data = {}) {
    const badge = document.getElementById(`status-${id}`);
    const msg = document.getElementById(`msg-${id}`);

    if (state === "up") {
        badge.className = "status-indicator up";
        badge.innerText = "ONLINE";
        msg.innerText = `Response: ${data.responseTime} ms`;
    } else {
        badge.className = "status-indicator down";
        badge.innerText = "OFFLINE";
        msg.innerText = "Last offline: just now";
    }
}

});