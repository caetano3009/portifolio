/* ======================================================
   LevelUp Finance – Arena JS
   Sistema de batalha contra dívidas com persistência
====================================================== */

// Carregar estado dos monstros do localStorage
function loadMonsters() {
  return JSON.parse(localStorage.getItem("monsters") || "null");
}

function saveMonsters() {
  const data = {};
  document.querySelectorAll(".monster-card").forEach(card => {
    const btn = card.querySelector(".attack-btn");
    if (btn) {
      data[btn.dataset.monster] = {
        currenthp: btn.dataset.currenthp,
        defeated: btn.disabled
      };
    }
  });
  localStorage.setItem("monsters", JSON.stringify(data));
}

// Restaurar estado salvo
function restoreMonsters() {
  const saved = loadMonsters();
  if (!saved) return;

  document.querySelectorAll(".attack-btn").forEach(btn => {
    const key = btn.dataset.monster;
    if (saved[key]) {
      const hp = Number(saved[key].currenthp);
      btn.dataset.currenthp = hp;

      // Atualizar texto HP
      const card = btn.closest(".monster-card");
      const hpText = card.querySelector(btn.dataset.hptext);
      if (hpText) hpText.innerText = `$${hp.toLocaleString("pt-BR")}`;

      // Atualizar barra
      const fill = card.querySelector(btn.dataset.fill);
      const maxHp = getMaxHp(key);
      if (fill) fill.style.width = `${(hp / maxHp) * 100}%`;

      // Derrotado?
      if (saved[key].defeated || hp === 0) markDefeated(btn);
    }
  });
}

function getMaxHp(monster) {
  if (monster === "Hidra do Estudante")    return 15000;
  if (monster === "Fera do Financiamento") return 8000;
  return 5000; // Dragão do Cartão
}

function markDefeated(btn) {
  btn.innerHTML = `<i class="bi bi-trophy-fill"></i> MONSTRO DERROTADO`;
  btn.style.background = "#29c76f";
  btn.disabled = true;
}

// ── Modal ─────────────────────────────────────────────
const attackButtons    = document.querySelectorAll(".attack-btn");
const attackModal      = document.getElementById("attackModal");
const closeAttackModal = document.getElementById("closeAttackModal");
const confirmAttack    = document.getElementById("confirmAttack");
const attackInput      = document.getElementById("attackInput");
const attackTitle      = document.getElementById("attackTitle");
const minimumDamage    = document.getElementById("minimumDamage");
const currentHpEl      = document.getElementById("currentHp");

let selectedBtn = null;

attackButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.disabled) return;
    selectedBtn = btn;

    const monster = btn.dataset.monster;
    const hp      = Number(btn.dataset.currenthp);
    const minimum = Number(btn.dataset.minimum);

    attackTitle.innerText      = `ATACAR ${monster.toUpperCase()}`;
    minimumDamage.innerText    = `Dano mínimo: $${minimum}`;
    currentHpEl.innerText      = `HP Atual: $${hp.toLocaleString("pt-BR")}`;
    attackInput.value          = minimum;
    attackModal.classList.add("active");
  });
});

closeAttackModal.addEventListener("click", () => attackModal.classList.remove("active"));
attackModal.addEventListener("click", e => { if (e.target === attackModal) attackModal.classList.remove("active"); });

confirmAttack.addEventListener("click", () => {
  if (!selectedBtn) return;

  let currentHp   = Number(selectedBtn.dataset.currenthp);
  const attackVal = Number(attackInput.value);
  const minimum   = Number(selectedBtn.dataset.minimum);

  if (isNaN(attackVal) || attackVal <= 0) {
    alert("Digite um valor de ataque válido.");
    return;
  }

  if (attackVal < minimum) {
    alert(`⚠ O ataque mínimo é $${minimum}`);
    return;
  }

  currentHp -= attackVal;
  if (currentHp < 0) currentHp = 0;

  selectedBtn.dataset.currenthp = currentHp;

  // Atualizar texto
  const card   = selectedBtn.closest(".monster-card");
  const hpText = card.querySelector(selectedBtn.dataset.hptext);
  if (hpText) hpText.innerText = `$${currentHp.toLocaleString("pt-BR")}`;

  // Atualizar barra
  const fill  = card.querySelector(selectedBtn.dataset.fill);
  const maxHp = getMaxHp(selectedBtn.dataset.monster);
  if (fill) fill.style.width = `${(currentHp / maxHp) * 100}%`;

  // Registrar pagamento de dívida como despesa
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  transactions.push({
    type: "expense",
    name: `Pagamento: ${selectedBtn.dataset.monster}`,
    value: attackVal,
    category: "Dívida",
    date: new Date().toISOString()
  });
  localStorage.setItem("transactions", JSON.stringify(transactions));

  if (currentHp === 0) markDefeated(selectedBtn);

  saveMonsters();
  attackModal.classList.remove("active");

  // Toast
  const toast = document.createElement("div");
  toast.textContent = currentHp === 0
    ? `🏆 ${selectedBtn.dataset.monster} DERROTADO! +500 XP`
    : `⚔ Ataque de $${attackVal.toFixed(2)} aplicado!`;
  toast.style.cssText = `position:fixed;bottom:30px;right:30px;z-index:9999;
    background:#252525;border:2px solid #ff5100;color:#ff5100;
    padding:14px 22px;font-family:monospace;font-size:15px;`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
});

// Init
restoreMonsters();
