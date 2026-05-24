/* ======================================================
   LevelUp Finance – Santuário JS (VERSÃO FUNCIONAL)
====================================================== */

const WELLS_KEY = "luf_wells";
const TXS_KEY   = "luf_transactions";

function loadWells() {
  return JSON.parse(localStorage.getItem(WELLS_KEY) || "null");
}

function saveWells() {
  const data = [];
  document.querySelectorAll(".well-card").forEach(card => {
    data.push({
      name:    card.dataset.name,
      current: Number(card.dataset.current),
      target:  Number(card.dataset.target),
      date:    card.dataset.date,
      border:  card.dataset.border || "purple-border"
    });
  });
  localStorage.setItem(WELLS_KEY, JSON.stringify(data));
}

// ── Criar card ────────────────────────────────────────
function createWellCard(name, target, date, current = 0, borderClass = "purple-border") {
  const grid      = document.getElementById("wellsGrid");
  const pct       = Math.min(Math.floor((current / target) * 100), 100);
  const remaining = Math.max(target - current, 0);

  const card = document.createElement("div");
  card.className       = `well-card ${borderClass}`;
  card.dataset.current = current;
  card.dataset.target  = target;
  card.dataset.name    = name;
  card.dataset.date    = date;
  card.dataset.border  = borderClass;

  card.innerHTML = `
    <div class="well-header">
      <div class="well-icon"><i class="bi bi-stars"></i></div>
      <div>
        <h3>${name}</h3>
        <span><i class="bi bi-calendar3"></i> ${date}</span>
      </div>
    </div>
    <div class="well-visual">
      <div class="visual-fill" style="height:${pct}%"></div>
      <div class="percent-text">${pct}%</div>
    </div>
    <div class="small-progress">
      <div class="small-fill" style="width:${pct}%"></div>
    </div>
    <div class="well-stats">
      <div class="stat-row">
        <span>Atual:</span>
        <strong class="purple current-value">R$${Number(current).toLocaleString("pt-BR",{minimumFractionDigits:2})}</strong>
      </div>
      <div class="stat-row">
        <span>Meta:</span>
        <strong class="target-value">R$${Number(target).toLocaleString("pt-BR",{minimumFractionDigits:2})}</strong>
      </div>
      <div class="stat-row">
        <span>Restante:</span>
        <strong class="yellow remaining-value">R$${remaining.toLocaleString("pt-BR",{minimumFractionDigits:2})}</strong>
      </div>
    </div>
    <button class="mana-btn"><i class="bi bi-gem"></i> ADICIONAR MANA</button>
    <button class="delete-well-btn" title="Remover meta"><i class="bi bi-trash"></i></button>
  `;

  grid.appendChild(card);
  bindManaButton(card);
  bindDeleteButton(card);
  updateTotals();
}

function bindManaButton(card) {
  card.querySelector(".mana-btn").addEventListener("click", () => {
    currentCard = card;
    const name      = card.dataset.name;
    const current   = Number(card.dataset.current);
    const target    = Number(card.dataset.target);
    const remaining = target - current;
    document.getElementById("modalTitle").innerText     = `ADICIONAR MANA EM ${name.toUpperCase()}`;
    document.getElementById("modalCurrent").innerText   = `Atual: R$${current.toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
    document.getElementById("modalRemaining").innerText = `Restante: R$${remaining.toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
    document.getElementById("manaInput").value          = "";
    manaModal.classList.add("active");
  });
}

function bindDeleteButton(card) {
  card.querySelector(".delete-well-btn").addEventListener("click", () => {
    if (confirm(`Remover meta "${card.dataset.name}"?`)) {
      card.remove();
      saveWells();
      updateTotals();
    }
  });
}

// ── Totais ────────────────────────────────────────────
function updateTotals() {
  let totalCurrent = 0, totalTarget = 0;
  document.querySelectorAll(".well-card").forEach(c => {
    totalCurrent += Number(c.dataset.current);
    totalTarget  += Number(c.dataset.target);
  });
  const pct = totalTarget > 0 ? Math.min(Math.floor((totalCurrent / totalTarget) * 100), 100) : 0;
  document.querySelector(".mana-values").innerHTML =
    `<span>R$${totalCurrent.toLocaleString("pt-BR",{minimumFractionDigits:2})} / R$${totalTarget.toLocaleString("pt-BR",{minimumFractionDigits:2})}</span>
     <span>${pct}%</span>`;
  document.querySelector(".total-progress-fill").style.width = pct + "%";
  document.getElementById("activeWells").innerText = document.querySelectorAll(".well-card").length;
}

// ── Refs ──────────────────────────────────────────────
const manaModal    = document.getElementById("manaModal");
const wellModal    = document.getElementById("wellModal");
const closeModal   = document.getElementById("closeModal");
const depositBtn   = document.getElementById("depositBtn");
const manaInput    = document.getElementById("manaInput");
const openWellModal  = document.getElementById("openWellModal");
const closeWellModal = document.getElementById("closeWellModal");
const createWellBtn  = document.getElementById("createWellBtn");
let currentCard = null;

closeModal.addEventListener("click",   () => manaModal.classList.remove("active"));
closeWellModal.addEventListener("click", () => wellModal.classList.remove("active"));
manaModal.addEventListener("click", e => { if (e.target === manaModal) manaModal.classList.remove("active"); });
wellModal.addEventListener("click", e => { if (e.target === wellModal) wellModal.classList.remove("active"); });
openWellModal.addEventListener("click", () => wellModal.classList.add("active"));

// Depositar
depositBtn.addEventListener("click", () => {
  if (!currentCard) return;
  const value = parseFloat(manaInput.value);
  if (isNaN(value) || value <= 0) { alert("Digite um valor válido."); return; }

  let current = Number(currentCard.dataset.current);
  const target  = Number(currentCard.dataset.target);
  current = Math.min(current + value, target);
  const remaining = target - current;
  const pct = Math.floor((current / target) * 100);

  currentCard.dataset.current = current;
  currentCard.querySelector(".current-value").innerText   = `R$${current.toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
  currentCard.querySelector(".remaining-value").innerText = `R$${remaining.toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
  currentCard.querySelector(".percent-text").innerText    = `${pct}%`;
  currentCard.querySelector(".visual-fill").style.height  = `${pct}%`;
  currentCard.querySelector(".small-fill").style.width    = `${pct}%`;

  // Registrar no dashboard
  const txs = JSON.parse(localStorage.getItem(TXS_KEY) || "[]");
  txs.push({ type: "income", name: `Mana: ${currentCard.dataset.name}`, value, category: "Poupança", date: new Date().toISOString() });
  localStorage.setItem(TXS_KEY, JSON.stringify(txs));

  saveWells();
  updateTotals();
  manaModal.classList.remove("active");
  showToast(`+R$${value.toFixed(2)} adicionado ao poço! ✨`);
});

// Criar novo poço
createWellBtn.addEventListener("click", () => {
  const name   = document.getElementById("goalName").value.trim();
  const amount = parseFloat(document.getElementById("goalAmount").value);
  const date   = document.getElementById("goalDate").value;
  if (!name || isNaN(amount) || amount <= 0 || !date) { alert("Preencha todos os campos."); return; }
  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("pt-BR", { day:"2-digit", month:"short", year:"numeric" });
  createWellCard(name, amount, formattedDate, 0, "purple-border");
  document.getElementById("goalName").value   = "";
  document.getElementById("goalAmount").value = "";
  document.getElementById("goalDate").value   = "";
  saveWells();
  wellModal.classList.remove("active");
});

function showToast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText = `position:fixed;bottom:30px;right:30px;z-index:9999;
    background:#252525;border:2px solid #9333ea;color:#9333ea;
    padding:14px 22px;font-family:monospace;font-size:15px;`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// Init — restaurar dados ou usar defaults
const savedWells = loadWells();
if (savedWells && savedWells.length > 0) {
  savedWells.forEach(w => createWellCard(w.name, w.target, w.date, w.current, w.border));
} else {
  // Poços padrão
  createWellCard("Fundo de Emergência", 10000, "31/dez/2025", 3200, "green-border");
  createWellCard("Viagem dos Sonhos",   20000, "30/jun/2026", 5400, "purple-border");
  createWellCard("Reserva Técnica",      5000, "31/mar/2026", 1200, "purple-border");
  createWellCard("Novo Notebook",        2000, "28/fev/2026",  800, "yellow-border");
  saveWells();
}
