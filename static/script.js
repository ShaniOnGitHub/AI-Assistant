// ============================================================
//  Shan — Clean Chat Logic
// ============================================================

// ── DOM Elements ────────────────────────────────────────────
const messagesContainer = document.getElementById('messagesContainer');
const welcomeScreen     = document.getElementById('welcomeScreen');
const loadingIndicator  = document.getElementById('loadingIndicator');
const messageInput      = document.getElementById('messageInput');
const chatForm          = document.getElementById('chatForm');
const clearBtn          = document.getElementById('clearBtn');
const sendBtn           = document.getElementById('sendBtn');
const sendIcon          = document.getElementById('sendIcon');
const sendSpinner       = document.getElementById('sendSpinner');

const themeToggle       = document.getElementById('themeToggle');
const adminToggle       = document.getElementById('adminToggle');
const adminBanner       = document.getElementById('adminBanner');

const modelBtn          = document.getElementById('modelBtn');
const modelBtnLabel     = document.getElementById('modelBtnLabel');
const modelDropdown     = document.getElementById('modelDropdown');
const dropdownItems     = document.querySelectorAll('.dropdown-item');

// ── State ────────────────────────────────────────────────────
let selectedModel = 'llama';
let adminMode     = localStorage.getItem('adminMode') === 'true';

const MODEL_META = {
  llama:   { name: 'Llama 3.3', dotColor: 'var(--lime)',  dotClass: 'bg-lime' },
  granite: { name: 'Mixtral',   dotColor: 'var(--lilac)', dotClass: 'bg-lilac' },
  mistral: { name: 'Gemma 2',   dotColor: 'var(--coral)', dotClass: 'bg-coral' }
};

// ── Admin Mode Logic ─────────────────────────────────────────
function setAdminMode(active) {
  adminMode = active;
  localStorage.setItem('adminMode', active);
  
  if (active) {
    adminToggle.classList.add('active');
    adminBanner.style.display = 'flex';
  } else {
    adminToggle.classList.remove('active');
    adminBanner.style.display = 'none';
  }

  // Toggle existing cards
  document.querySelectorAll('.admin-card').forEach(card => {
    if (active) {
      card.classList.add('visible');
    } else {
      card.classList.remove('visible');
    }
  });
}

adminToggle.addEventListener('click', () => {
  setAdminMode(!adminMode);
});

// ── Theme Switcher ───────────────────────────────────────────
function getTheme() { return localStorage.getItem('theme') || 'dark'; }
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
  applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
});

// ── Model Picker Dropdown ────────────────────────────────────
modelBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  modelDropdown.classList.toggle('open');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!modelDropdown.contains(e.target) && e.target !== modelBtn) {
    modelDropdown.classList.remove('open');
  }
});

dropdownItems.forEach(item => {
  item.addEventListener('click', () => {
    // Reset active item
    dropdownItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // Update state & button label
    selectedModel = item.dataset.model;
    modelBtnLabel.textContent = item.dataset.label;
    
    // Close dropdown
    modelDropdown.classList.remove('open');
  });
});

// ── Textarea Management ──────────────────────────────────────
messageInput.addEventListener('input', () => {
  messageInput.style.height = 'auto';
  messageInput.style.height = Math.min(messageInput.scrollHeight, 160) + 'px';
});

messageInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.requestSubmit();
  }
});

// ── Helpers ──────────────────────────────────────────────────
function fmtTime(d = new Date()) {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function scrollBottom() {
  document.getElementById('messagesEnd').scrollIntoView({ behavior: 'smooth' });
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

// ── Messages rendering ───────────────────────────────────────
function addUserMessage(text) {
  welcomeScreen.style.display = 'none';
  clearBtn.style.display = 'block';

  const g = document.createElement('div');
  g.className = 'msg-group user';
  g.innerHTML = `
    <div class="msg-meta">You &middot; ${fmtTime()}</div>
    <div class="user-bubble">
      <div class="msg-icon-wrap icon-lime">👤</div>
      <div class="msg-text-content">${esc(text)}</div>
    </div>
  `;
  messagesContainer.appendChild(g);
  scrollBottom();
}

function addAIResponse(data, model, duration) {
  const meta = MODEL_META[model] || MODEL_META.llama;
  const score = typeof data.sentiment === 'number' ? data.sentiment : 50;
  const dur = typeof duration === 'number' ? duration.toFixed(2) + 's' : '—';
  
  // Custom colors matching the neon palette
  const sentColor = score >= 60 ? 'var(--lime)' : score >= 40 ? 'var(--lilac)' : 'var(--coral)';
  const sentLabel = score >= 60 ? 'Positive' : score >= 40 ? 'Neutral' : 'Negative';

  const g = document.createElement('div');
  g.className = 'msg-group ai';
  
  g.innerHTML = `
    <div class="msg-meta">${esc(meta.name)} &middot; ${fmtTime()}</div>
    <div class="ai-bubble">
      <div class="msg-icon-wrap icon-lilac">💬</div>
      <div class="ai-text-content">${esc(data.response || '—')}</div>
    </div>
    
    <!-- Admin metadata card -->
    <div class="admin-card ${adminMode ? 'visible' : ''}">
      <div class="ac-head">
        <div class="ac-model">
          <span class="d-dot ${meta.dotClass}" style="width:6px; height:6px;"></span>
          ${esc(meta.name)}
        </div>
        <div class="ac-time">⏱ ${esc(dur)}</div>
      </div>
      <div class="ac-body">
        <div class="ac-row">
          <div class="ac-label">Summary</div>
          <div class="ac-val">${esc(data.summary || '—')}</div>
        </div>
        <div class="ac-rule"></div>
        <div class="ac-row">
          <div class="ac-label">Sentiment Analysis</div>
          <div class="sent-row">
            <div class="sent-track">
              <div class="sent-fill" style="width: ${score}%; background: ${sentColor}"></div>
            </div>
            <div class="sent-num" style="color:${sentColor}">${score}</div>
            <div class="sent-lbl">${sentLabel}</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  messagesContainer.appendChild(g);
  scrollBottom();
}

function addError(msg) {
  const g = document.createElement('div');
  g.className = 'msg-group ai';
  g.innerHTML = `
    <div class="msg-meta">Error &middot; ${fmtTime()}</div>
    <div class="error-bubble">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0; margin-top:2px">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>${esc(msg)}</span>
    </div>
  `;
  messagesContainer.appendChild(g);
  scrollBottom();
}

// ── Submit Handling ──────────────────────────────────────────
function setLoading(on) {
  loadingIndicator.style.display = on ? 'flex' : 'none';
  sendBtn.disabled               = on;
  messageInput.disabled          = on;
  sendIcon.style.display         = on ? 'none' : 'block';
  sendSpinner.style.display      = on ? 'block' : 'none';
  if (on) scrollBottom();
}

chatForm.addEventListener('submit', async e => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  addUserMessage(text);
  messageInput.value = '';
  messageInput.style.height = 'auto';
  setLoading(true);

  const start = Date.now();

  try {
    const res = await fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, model: selectedModel })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      addError(data.error || `Server error ${res.status}`);
    } else {
      addAIResponse(data, selectedModel, data.duration ?? (Date.now() - start) / 1000);
    }
  } catch (err) {
    addError('Could not reach the local server. Make sure the Flask backend is running.');
  } finally {
    setLoading(false);
    messageInput.focus();
  }
});

// ── Suggestion Cards ─────────────────────────────────────────
window.fillSuggestion = function(text) {
  messageInput.value = text;
  messageInput.style.height = 'auto';
  messageInput.style.height = Math.min(messageInput.scrollHeight, 160) + 'px';
  messageInput.focus();
};

// ── Clear Chat ───────────────────────────────────────────────
clearBtn.addEventListener('click', () => {
  messagesContainer.innerHTML = '';
  welcomeScreen.style.display = 'flex';
  clearBtn.style.display      = 'none';
});

// ── Initialization ───────────────────────────────────────────
applyTheme(getTheme());
setAdminMode(adminMode);

messageInput.focus();
