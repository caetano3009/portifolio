/* ======================================================
   LevelUp Finance – Santuário JS
   Poços de mana (metas de poupança) com persistência
====================================================== */

// ── Persistência ──────────────────────────────────────
function loadWells() {
  return JSON.parse(localStorage.getItem("wells") || "null");
}

function saveWells() {
  const data = [];
  document.querySelectorAll(".well-card").forEach(card => {
    data.push({
      name:    card.querySelector("h3").innerText,
      current: Number(card.dataset.current),
      target:  Number(card.dataset.target),
      date:    card.querySelector(".well-header span").innerText.trim(),
      border:  card.className.match(/(\w+-border)/)?.[1] || "purple-border"
    });
  });
  localStorage.setItem("wells", JSON.stringify(data));
}

function restoreWells() {
  const saved = loadWells();
  if (!saved) return;

  const grid = document.getElementById("wellsGrid");
  grid.innerHTML = "";
  saved.forEach(w => createWellCard(w.name, w.target, w.date, w.current, w.border));
  updateTotals();
}

// ── Criar card ────────────────────────────────────────
function createWellCard(name, target, date, current = 0, borderClass = "purple-border") {
  const grid    = document.getElementById("wellsGrid");
  const pct     = Math.min(Math.floor((current / target) * 100), 100);
  const remaining = Math.max(target - current, 0);

  const card = document.createElement("div");
  card.className = `well-card ${borderClass}`;
  card.dataset.current = current;
  card.dataset.target  = target;

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
        <strong class="purple current-value">$${Number(current).toLocaleString("pt-BR",{minimumFractionDigits:2})}</strong>
      </div>
      <div class="stat-row">
        <span>Meta:</span>
        <strong class="target-value">$${Number(target).toLocaleString("pt-BR",{minimumFractionDigits:2})}</strong>
      </div>
      <div class="stat-row">
        <span>Restante:</span>
        <strong class="yellow remaining-value">$${remaining.toLocaleString("pt-BR",{minimumFractionDigits:2})}</strong>
      </div>
    </div>
    <button class="mana-btn"><i class="bi bi-gem"></i> ADICIONAR MANA</button>
  `;

  grid.appendChild(card);
  bindManaButton(card);
  updateTotals();
}

// ── Bind botão mana ───────────────────────────────────
function bindManaButton(card) {
  card.querySelector(".mana-btn").addEventListener("click", () => {
    currentCard = card;
    const name      = card.querySelector("h3").innerText;
    const current   = Number(card.dataset.current);
    const target    = Number(card.dataset.target);
    const remaining = target - current;

    document.getElementById("modalTitle").innerText     = `ADICIONAR MANA EM ${name.toUpperCase()}`;
    document.getElementById("modalCurrent").innerText   = `Atual: $${current.toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
    document.getElementById("modalRemaining").innerText = `Restante: $${remaining.toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
    document.getElementById("manaInput").value          = "";

    manaModal.classList.add("active");
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
    `<span>$${totalCurrent.toLocaleString("pt-BR",{minimumFractionDigits:2})} / $${totalTarget.toLocaleString("pt-BR",{minimumFractionDigits:2})}</span>
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

// Fechar modais
closeModal.addEventListener("click",   () => manaModal.classList.remove("active"));
closeWellModal.addEventListener("click", () => wellModal.classList.remove("active"));
manaModal.addEventListener("click", e => { if (e.target === manaModal) manaModal.classList.remove("active"); });
wellModal.addEventListener("click", e => { if (e.target === wellModal) wellModal.classList.remove("active"); });

// Abrir novo poço
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
  currentCard.querySelector(".current-value").innerText   = `$${current.toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
  currentCard.querySelector(".remaining-value").innerText = `$${remaining.toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
  currentCard.querySelector(".percent-text").innerText    = `${pct}%`;
  currentCard.querySelector(".visual-fill").style.height  = `${pct}%`;
  currentCard.querySelector(".small-fill").style.width    = `${pct}%`;

  // Registrar como receita de poupança no dashboard
  const txs = JSON.parse(localStorage.getItem("transactions") || "[]");
  txs.push({
    type: "income",
    name: `Mana: ${currentCard.querySelector("h3").innerText}`,
    value,
    category: "Poupança",
    date: new Date().toISOString()
  });
  localStorage.setItem("transactions", JSON.stringify(txs));

  saveWells();
  updateTotals();
  manaModal.classList.remove("active");

  // Toast
  showToast(`+$${value.toFixed(2)} adicionado ao poço! ✨`);
});

// Criar novo poço
createWellBtn.addEventListener("click", () => {
  const name   = document.getElementById("goalName").value.trim();
  const amount = parseFloat(document.getElementById("goalAmount").value);
  const date   = document.getElementById("goalDate").value;

  if (!name || isNaN(amount) || amount <= 0 || !date) {
    alert("Preencha todos os campos.");
    return;
  }

  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("pt-BR", { day:"2-digit", month:"short", year:"numeric" });
  createWellCard(name, amount, formattedDate, 0, "purple-border");

  document.getElementById("goalName").value   = "";
  document.getElementById("goalAmount").value = "";
  document.getElementById("goalDate").value   = "";
  saveWells();
  wellModal.classList.remove("active");
});

// Toast
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
if (savedWells) {
  restoreWells();
} else {
  // Rebindar botões dos cards HTML padrão
  document.querySelectorAll(".well-card").forEach(bindManaButton);
  updateTotals();
}
