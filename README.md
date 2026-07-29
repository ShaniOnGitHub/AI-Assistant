# shan — Personal AI Chat Assistant

A small Flask app with a Groq backed chat interface. Built as a personal
project to try out a few different model sizes behind one UI and to
practice building a custom frontend instead of using a chat library.

## What it does

- Single chat endpoint (`/generate`) that routes to one of three models
  on Groq: `llama-3.3-70b-versatile`, `qwen/qwen3-32b`, or
  `llama-3.1-8b-instant`, selectable from the UI.
- Every response is asked to come back as structured JSON (summary,
  a 0 to 100 sentiment score, and the reply text), which the frontend
  uses to show a small telemetry panel: response time, sentiment, and
  a one line summary alongside the actual answer.
- Custom animated frontend (vanilla JS and CSS, no framework) with a
  dark and a light theme.

## Stack

Flask, the Groq API through the OpenAI compatible client, vanilla JS/CSS
for the frontend.

## Running locally

```bash
cp .env.example .env   # add GROQ_API_KEY
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000.

## Notes

This was a learning project for trying multiple model sizes and building
a non trivial frontend by hand. It is not production hardened: there is
no rate limiting, no auth, and error handling is minimal.
