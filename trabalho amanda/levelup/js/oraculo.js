/* ======================================================
   LevelUp Finance – Oráculo JS
   Missões semanais + insights dinâmicos
====================================================== */

// Checkboxes das missões
const checkboxes = document.querySelectorAll(".quest-card input[type=checkbox]");

checkboxes.forEach(cb => {
  // Restaurar estado salvo
  const key = "quest_" + cb.closest(".quest-card").querySelector("strong").innerText;
  if (localStorage.getItem(key) === "true") {
    cb.checked = true;
    cb.closest(".quest-card").classList.add("completed");
  }

  cb.addEventListener("change", () => {
    const card = cb.closest(".quest-card");
    if (cb.checked) {
      card.classList.add("completed");
      localStorage.setItem(key, "true");
      showToast("+XP ganho pela missão! 🏆");
    } else {
      card.classList.remove("completed");
      localStorage.removeItem(key);
    }
    updateXPDisplay();
  });
});

// Botões XP
document.querySelectorAll(".xp-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const cb = btn.closest(".quest-card").querySelector("input");
    if (!cb.checked) {
      alert("Complete a missão primeiro!");
    }
  });
});

// Atualizar XP disponível
function updateXPDisplay() {
  const completed = document.querySelectorAll(".quest-card.completed").length;
  const total     = document.querySelectorAll(".quest-card").length;
  const xpEl = document.querySelector(".quest-top span");
  if (xpEl) {
    const remaining = (total - completed) * 150;
    xpEl.textContent = `${remaining} XP disponíveis`;
  }
}

// Insights dinâmicos baseados nos dados reais
function buildInsights() {
  const txs = JSON.parse(localStorage.getItem("transactions") || "[]");
  if (txs.length === 0) return;

  const income  = txs.filter(t => t.type === "income").reduce((s,t) => s+t.value, 0);
  const expense = txs.filter(t => t.type === "expense").reduce((s,t) => s+t.value, 0);
  const balance = income - expense;
  const rate    = income > 0 ? Math.round((balance / income) * 100) : 0;

  // Atualizar Sabedoria Antiga
  const cards = document.querySelectorAll(".wisdom-card h3");
  if (cards.length >= 2) {
    cards[1].textContent = rate + "%";
  }
}

function showToast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText = `position:fixed;bottom:30px;right:30px;z-index:9999;
    background:#252525;border:2px solid #ffd400;color:#ffd400;
    padding:14px 22px;font-family:monospace;font-size:15px;`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

updateXPDisplay();
buildInsights();
