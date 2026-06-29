import os

# ── Load local .env manually if it exists ──────────────────────────────────
# This avoids external python-dotenv dependency and keeps credentials safe
env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                os.environ[key.strip()] = val.strip()

# ── Groq API Key (Loaded from environment) ────────────────────────────────────
GROQ_API_KEY  = os.environ.get("GROQ_API_KEY", "")
GROQ_BASE_URL = "https://api.groq.com/openai/v1"

# ── Active Model ──────────────────────────────────────────────────────────────
MODEL_ID = "llama-3.3-70b-versatile"   # Free on Groq, no card needed

# ── Generation Parameters ─────────────────────────────────────────────────────
PARAMETERS = {
    "temperature": 0.7,
    "max_tokens": 512,
}

# =============================================================================
# LEARNING REFERENCE — Other backends tried
# =============================================================================
# xAI Grok:  "grok-3", "grok-3-mini"          → PAID, needs console.x.ai credits
# Gemini:    "gemini-2.0-flash"                → Free but needs valid AIzaSy key
# IBM Watson: "meta-llama/llama-3-2-11b..."   → Used langchain-ibm / ChatWatsonx
# Groq free models: "mixtral-8x7b-32768", "gemma2-9b-it", "llama-3.1-8b-instant"
# =============================================================================
