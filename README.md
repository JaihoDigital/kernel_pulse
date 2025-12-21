
# 🚀 Kernel Pulse

**Kernel Pulse** is an open-source, serverless **status page + uptime monitoring tool** built for developers and small teams.

It provides:
- A clean, real-time status dashboard
- On-demand website & API health checks
- A public JSON API
- Zero database, zero backend maintenance

![Status](https://img.shields.io/badge/status-active-success?style=flat-square)
![Serverless](https://img.shields.io/badge/serverless-yes-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Deployed on](https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat-square)
![API](https://img.shields.io/badge/API-public-brightgreen?style=flat-square)

---

## ✨ Key Features

- ✅ Real-time website & API status checks
- 🔄 Manual scan + Auto-Refresh (30s)
- ⚡ Quick Probe for instant URL testing
- 🕘 Client-side probe history (localStorage)
- 📡 Public JSON API (`/api/json`)
- 🛡️ Rate-limited & SSRF-protected API
- 🌐 Fully serverless (Vercel)
- 📦 No database, no cron jobs

---

## 🧠 How It Works


- The UI runs in the browser
- All network checks are performed server-side
- Results are returned instantly as JSON

---

## 🖥️ Dashboard Overview

The dashboard displays:
- Service status (ONLINE / OFFLINE)
- Response time (ms)
- Global system health
- Last scan time

Quick Probe lets you test **any URL instantly**, without editing configuration.

---

## 📂 Configuration (`config.json`)

Kernel Pulse is configured using a single file:

```json
{
  "brand": {
    "name": "Kernel Pulse",
    "parent": "Jaiho Kernel",
    "url": "https://jaiho-digital.onrender.com/page_kernel.html",
    "logo_icon": "fas fa-heart-pulse"
  },
  "categories": [
    {
      "name": "Utilities & Privacy",
      "services": [
        {
          "id": "j-ip",
          "name": "Jaiho IP",
          "url": "https://jaiho-ip.vercel.app",
          "desc": "IP Detection API"
        }
      ]
    }
  ]
}
```

### Rules
- id must be unique
- url must be publicly accessible
- No rebuild required — just refresh the page

## 🌐 Public API

Kernel Pulse exposes a simple JSON API.

### Endpoint
`GET /api/json?url=https://example.com`

### Example Response
```
{
  "service": "Kernel Pulse",
  "target": "https://example.com",
  "status": "online",
  "up": true,
  "responseTimeMs": 213,
  "checkedAt": "2025-01-20T12:30:00Z",
  "source": "vercel-serverless"
}
```

### JavaScript Example
```
fetch('https://kernel-pulse.vercel.app/api/json?url=https://google.com')
  .then(res => res.json())
  .then(data => {
    console.log(data.status);
    console.log(data.responseTimeMs);
  });
```

### Python Example
```
import requests

r = requests.get(
    "https://kernel-pulse.vercel.app/api/json",
    params={"url": "https://google.com"}
)

print(r.json())
```

## 🚦 API Rate Limits
- 60 requests per minute per IP
- Applies to /api/json
- Returns HTTP 429 if exceeded

This API is intended for lightweight monitoring and dashboards.

## 🚀 Deployment
### Deploy on Vercel or your own Server
1. Fork the repository
2. Go to https://vercel.com
3. Import the GitHub repo
4. Click Deploy

No build step required. These steps are for using Vercel.

## 🧰 Tech Stack
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Vercel Serverless Functions
- **Storage:** None (client-side localStorage only)
- **Deployment:** Vercel

## 🤝 Contributing
Contributions are welcome!

- Fork the repo
- Create a feature branch
- Submit a pull request

Please keep changes minimal and documented.

## 📜 License
This project is licensed under the `MIT License`.

## 💡 Philosophy
Kernel Pulse is intentionally simple:
- No background jobs
- No databases
- No vendor lock-in

Transparency > complexity.
<hr>

**Developed by [Jaiho Kernel](https://jaiho-digital.onrender.com/page_kernel.html).**
