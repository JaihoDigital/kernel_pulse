# 💓 Kernel Pulse

![Status](https://img.shields.io/badge/status-operational-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Privacy](https://img.shields.io/badge/privacy-client--side-green)

**Kernel Pulse** is a lightweight, open-source, serverless status page generator. 

Unlike traditional monitoring tools that require expensive backend servers, Pulse runs entirely in the browser (Client-Side). It provides real-time "Health Checks" for your infrastructure without storing any data.

**Live Demo:** [https://jaiho-pulse.vercel.app](https://jaiho-pulse.vercel.app)

---

## ⚡ Key Features

* **Serverless:** No database or backend required. Hosted 100% free on Vercel.
* **Real-Time:** Checks status from the *user's* perspective (accurate connectivity testing).
* **Quick Probe:** Built-in tool to ping any external URL instantly.
* **Auto-Refresh:** Continuous monitoring mode (30s intervals).
* **Privacy First:** No tracking, no logs.
* **Customizable:** Edit one JSON file to monitor your own projects.

---

## 🚀 How to Deploy Your Own

You can have your own Status Page running in 30 seconds.

1.  **Fork this Repository** on GitHub.
2.  Open `config.json` and update the `services` list with your websites:
    ```json
    {
      "name": "My Status",
      "services": [
        { "id": "my-blog", "name": "Blog", "url": "[https://myblog.com](https://myblog.com)", "desc": "Personal Site" }
      ]
    }
    ```
3.  **Deploy to Vercel or your own Server:**
    * Go to Vercel.com -> Add New Project.
    * Select your forked repo.
    * Click **Deploy**.

That's it! 

---

## 🛠️ Tech Stack

* **Core:** HTML5, CSS3 (Variables), Vanilla JavaScript (ES6+).
* **Engine:** `fetch` API with `no-cors` mode for maximum compatibility.
* **Design:** Jaiho Kernel "Hacker" Aesthetic.

---

## 🤝 Contributing

This project is part of the **Jaiho Kernel** initiative.
Contributions are welcome! Please fork the repo and submit a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

Developed by **Arshvir** @ [Jaiho Digital](https://jaiho-digital.onrender.com).