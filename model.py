# =============================================================================
# model.py — AI Model Integration
# Active backend: Groq (free) — llama-3.3-70b-versatile
# =============================================================================

from openai import OpenAI
import json, re
from config import GROQ_API_KEY, GROQ_BASE_URL, PARAMETERS, LLAMA_MODEL, QWEN_MODEL, LLAMA_INSTANT_MODEL

# Groq uses an OpenAI-compatible API
client = OpenAI(api_key=GROQ_API_KEY, base_url=GROQ_BASE_URL)

SYSTEM_PROMPT = """You are a helpful AI assistant for Shani.
Always respond ONLY with a valid JSON object in this exact format — no extra text:
{
  "summary": "<one sentence summary of the user's message>",
  "sentiment": <integer 0-100, where 0=very negative, 100=very positive>,
  "response": "<your helpful, friendly reply>"
}"""

def call_model(user_message: str, system_prompt: str, model_id: str) -> dict:
    res = client.chat.completions.create(
        model=model_id,
        messages=[
            {"role": "system", "content": system_prompt + "\n\n" + SYSTEM_PROMPT},
            {"role": "user",   "content": user_message},
        ],
        temperature=PARAMETERS["temperature"],
        max_tokens=PARAMETERS["max_tokens"],
        response_format={"type": "json_object"},
    )
    text = res.choices[0].message.content.strip()
    text = re.sub(r'^```(?:json)?\s*', '', text)
    text = re.sub(r'\s*```$', '', text)
    data = json.loads(text)
    data["sentiment"] = max(0, min(100, int(data.get("sentiment", 50))))
    return data

# Dynamic multi-model routing on Groq backend
def llama_response(system_prompt: str, user_prompt: str) -> dict:
    return call_model(user_prompt, system_prompt, LLAMA_MODEL)

def granite_response(system_prompt: str, user_prompt: str) -> dict:
    return call_model(user_prompt, system_prompt, QWEN_MODEL)

def mistral_response(system_prompt: str, user_prompt: str) -> dict:
    return call_model(user_prompt, system_prompt, LLAMA_INSTANT_MODEL)
