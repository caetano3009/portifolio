/* ======================================================
   LevelUp Finance – Arena JS (VERSÃO FUNCIONAL)
   Monstros dinâmicos, HP persistido corretamente
====================================================== */

const MONSTERS_KEY = "luf_monsters";
const TXS_KEY = "luf_transactions";

// Definição dos monstros padrão
const MONSTER_DEFAULTS = {
  dragon: { name: "Dragão do Cartão",       maxHp: 5000,  currentHp: 5000,  minimum: 150, icon: "bi-credit-card",  color: "#ff5100" },
  hydra:  { name: "Hidra do Estudante",      maxHp: 15000, currentHp: 15000, minimum: 200, icon: "bi-mortarboard",  color: "#ff5100" },
  car:    { name: "Fera do Financiamento",   maxHp: 8000,  currentHp: 8000,  minimum: 280, icon: "bi-car-front",    color: "#ff5100" }
};

// Carregar estado do localStorage
function loadState() {
  const saved = localStorage.getItem(MONSTERS_KEY);
  if (saved) return JSON.parse(saved);
  // primeira vez: retornar defaults
  const state = {};
  Object.keys(MONSTER_DEFAULTS).forEach(k => {
    state[k] = { currentHp: MONSTER_DEFAULTS[k].currentHp, defeated: false };
  });
  return state;
}

function saveState(state) {
  localStorage.setItem(MONSTERS_KEY, JSON.stringify(state));
}

let monsterState = loadState();

// Renderizar todos os cards
function renderMonsters() {
  const grid = document.getElementById("monstersGrid");
  grid.innerHTML = "";

  const priorities = ["dragon", "car", "hydra"];
  priorities.forEach((key, idx) => {
    const def = MONSTER_DEFAULTS[key];
    const st  = monsterState[key];
    const hp  = st.currentHp;
    const pct = Math.max(Math.round((hp / def.maxHp) * 100), 0);
    const defeated = st.defeated || hp <= 0;

    const card = document.createElement("div");
    card.className = "monster-card";
    card.innerHTML = `
      <div class="priority-badge">PRIORIDADE ${idx + 1}</div>
      <div class="monster-icon"><i class="bi ${def.icon}"></i></div>
      <h3>${def.name}</h3>
      <div class="hp-header">
        <span>HP</span>
        <span>${hp.toLocaleString("pt-BR")} / ${def.maxHp.toLocaleString("pt-BR")}</span>
      </div>
      <div class="hp-bar">
        <div class="hp-fill" style="width:${pct}%;background:linear-gradient(90deg,${defeated ? '#34d399' : '#ff5100'},${defeated ? '#10b981' : '#ff6a00'})"></div>
      </div>
      <div class="monster-stats">
        <div class="stat-row"><span>HP Atual:</span><strong class="${defeated ? '' : 'danger'} hp-value">R$${hp.toLocaleString("pt-BR")}</strong></div>
        <div class="stat-row"><span>HP Máximo:</span><strong>R$${def.maxHp.toLocaleString("pt-BR")}</strong></div>
        <div class="stat-row"><span>Dano Mínimo:</span><strong class="warning">R$${def.minimum}</strong></div>
      </div>
      <button class="attack-btn${defeated ? ' defeated' : ''}" data-key="${key}" ${defeated ? 'disabled' : ''}>
        ${defeated ? '<i class="bi bi-trophy-fill"></i> MONSTRO DERROTADO' : '<i class="bi bi-sword"></i> ATACAR'}
      </button>
    `;
    grid.appendChild(card);
  });

  // Re-bind attack buttons
  document.querySelectorAll(".attack-btn:not(:disabled)").forEach(btn => {
    btn.addEventListener("click", () => openAttackModal(btn.dataset.key));
  });

  // Atualizar resumo
  updateStrategy();
}

function updateStrategy() {
  let totalHp = 0, count = 0;
  Object.keys(MONSTER_DEFAULTS).forEach(k => {
    const hp = monsterState[k].currentHp;
    const defeated = monsterState[k].defeated;
    if (!defeated && hp > 0) { totalHp += hp; count++; }
  });
  const totalEl = document.getElementById("strategyTotal");
  const countEl = document.getElementById("strategyCount");
  if (totalEl) totalEl.textContent = "R$" + totalHp.toLocaleString("pt-BR");
  if (countEl) countEl.textContent = count + " ativo" + (count !== 1 ? "s" : "");
}

// ── Modal de ataque ───────────────────────────────────
const attackModal = document.getElementById("attackModal");
let activeKey = null;

function openAttackModal(key) {
  activeKey = key;
  const def = MONSTER_DEFAULTS[key];
  const st  = monsterState[key];
  document.getElementById("attackTitle").textContent   = `ATACAR ${def.name.toUpperCase()}`;
  document.getElementById("minimumDamage").textContent  = `Dano mínimo: R$${def.minimum}`;
  document.getElementById("currentHp").textContent      = `HP Atual: R$${st.currentHp.toLocaleString("pt-BR")}`;
  document.getElementById("attackInput").value          = def.minimum;
  attackModal.classList.add("active");
}

document.getElementById("closeAttackModal").addEventListener("click", () => attackModal.classList.remove("active"));
attackModal.addEventListener("click", e => { if (e.target === attackModal) attackModal.classList.remove("active"); });

document.getElementById("confirmAttack").addEventListener("click", () => {
  if (!activeKey) return;
  const def      = MONSTER_DEFAULTS[activeKey];
  const attackVal = Number(document.getElementById("attackInput").value);

  if (isNaN(attackVal) || attackVal <= 0) { alert("Digite um valor válido."); return; }
  if (attackVal < def.minimum) { alert(`⚠ O ataque mínimo é R$${def.minimum}`); return; }

  let hp = monsterState[activeKey].currentHp - attackVal;
  if (hp < 0) hp = 0;

  monsterState[activeKey].currentHp = hp;
  if (hp === 0) monsterState[activeKey].defeated = true;
  saveState(monsterState);

  // Registrar pagamento como despesa
  const txs = JSON.parse(localStorage.getItem(TXS_KEY) || "[]");
  txs.push({ type: "expense", name: `Pagamento: ${def.name}`, value: attackVal, category: "Dívida", date: new Date().toISOString() });
  localStorage.setItem(TXS_KEY, JSON.stringify(txs));

  attackModal.classList.remove("active");
  renderMonsters();

  const msg = hp === 0 ? `🏆 ${def.name} DERROTADO! +500 XP` : `⚔ Ataque de R$${attackVal.toFixed(2)} aplicado!`;
  showToast(msg);
});

// ── Adicionar nova dívida ─────────────────────────────
const newDebtModal = document.getElementById("newDebtModal");
document.getElementById("openNewDebt")?.addEventListener("click", () => newDebtModal.classList.add("active"));
document.getElementById("closeNewDebt")?.addEventListener("click", () => newDebtModal.classList.remove("active"));
newDebtModal?.addEventListener("click", e => { if (e.target === newDebtModal) newDebtModal.classList.remove("active"); });

document.getElementById("createDebtBtn")?.addEventListener("click", () => {
  const name    = document.getElementById("debtName").value.trim();
  const total   = parseFloat(document.getElementById("debtTotal").value);
  const minimum = parseFloat(document.getElementById("debtMinimum").value);
  if (!name || isNaN(total) || total <= 0 || isNaN(minimum) || minimum <= 0) {
    alert("Preencha todos os campos."); return;
  }
  // Gerar chave única
  const key = "custom_" + Date.now();
  MONSTER_DEFAULTS[key] = { name, maxHp: total, currentHp: total, minimum, icon: "bi-exclamation-diamond", color: "#ff5100" };
  monsterState[key] = { currentHp: total, defeated: false };
  saveState(monsterState);
  document.getElementById("debtName").value = "";
  document.getElementById("debtTotal").value = "";
  document.getElementById("debtMinimum").value = "";
  newDebtModal.classList.remove("active");
  renderMonsters();
  showToast(`Nova dívida "${name}" adicionada!`);
});

function showToast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText = `position:fixed;bottom:30px;right:30px;z-index:9999;
    background:#252525;border:2px solid #ff5100;color:#ff5100;
    padding:14px 22px;font-family:monospace;font-size:15px;`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// Init
renderMonsters();
