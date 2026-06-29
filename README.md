# ⚡ shan — Premium Personal Virtual Assistant

<div align="center">
  <img src="logo.svg" width="120" height="120" alt="shan logo" />
  
  <h3>An ultra-premium, interactive AI personal assistant powered by Groq.</h3>
  
  <p align="center">
    <a href="#-features">Features</a> &bull;
    <a href="#-getting-started">Getting Started</a> &bull;
    <a href="#-project-structure">Project Structure</a> &bull;
    <a href="#-security">Security</a>
  </p>
</div>

---

## 🎨 Features

- 🌀 **Interactive Welcome Orb** — A beautifully animated, liquid-morphing chrome orb designed to react dynamically.
- 🌓 **Dynamic Dual Themes**
  - **Sleek Dark Mode** — Premium deep interface with sub-glow highlights.
  - **Neon Glassmorphic Light Mode** — Vertical neon-to-peach gradient backdrop with semi-transparent glass layers and dynamic high-contrast typography.
- ⚙️ **Developer Mode Dashboard** — Toggle detailed real-time API telemetry, request speeds, summaries, and sentiment metrics with a clean header button.
- 🏎️ **Groq-Accelerated Intelligence** — Rapid response mapping targeting Llama 3.3, Mixtral 8x7B, and Gemma 2.
- 🔒 **Zero-Secrets Configuration** — Native local environment decoupling using gitignore and dynamic `.env` loaders.

---

## 🚀 Getting Started

### 1. Clone & Set Up Directory
Ensure you are in the project root:
```bash
cd AI-Assistant
```

### 2. Configure Environment Secrets
Create a local `.env` file in the root folder:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Start the Application
Run the local Flask server:
```bash
python app.py
```
Open **[http://127.0.0.1:5000](http://127.0.0.1:5000)** in your browser!

---

## 📂 Project Structure

```
AI-Assistant/
├── static/
│   ├── script.js        # Dynamic UI transitions, model calls, and chat streams
│   └── styles.css       # Premium responsive layout and animations
├── templates/
│   └── index.html       # Clean bento layout with dynamic DOM entrypoints
├── .env                 # Local API credentials (ignored by Git)
├── .gitignore           # Safeguard credentials, logs, and cache targets
├── app.py               # Flask backend router & telemetry mapper
├── config.py            # Local environment variable parser & configurations
├── model.py             # Groq SDK integration & OpenAI-compatible pipelines
└── requirements.txt     # Python dependency locks
```

---

## 🔒 Security

This repository utilizes strict push-protection standards. To prevent security leaks, all local API keys are externalized to the local `.env` file, which is actively ignored in Git via `.gitignore`.
