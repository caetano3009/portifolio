/* ======================================================
   LevelUp Finance – Dashboard JS (VERSÃO FUNCIONAL)
   Todas as métricas reativas ao localStorage
====================================================== */

// ── Helpers de localStorage ──────────────────────────
function getTransactions() {
  return JSON.parse(localStorage.getItem("luf_transactions") || "[]");
}
function saveTransactions(list) {
  localStorage.setItem("luf_transactions", JSON.stringify(list));
}

// ── Cálculos ─────────────────────────────────────────
function calcSummary(transactions) {
  const now   = new Date();
  const month = now.getMonth();
  const year  = now.getFullYear();
  let income = 0, expense = 0;
  transactions.forEach(t => {
    const d = new Date(t.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      if (t.type === "income")  income  += t.value;
      if (t.type === "expense") expense += t.value;
    }
  });
  return { income, expense, balance: income - expense };
}

function calcDebtsSummary() {
  const monsters = JSON.parse(localStorage.getItem("luf_monsters") || "null");
  if (!monsters) {
    return { count: 3, total: 28200 };
  }
  const defaults = {
    "dragon": { hp: 5000, current: 3200 },
    "hydra":  { hp: 15000, current: 6800 },
    "car":    { hp: 8000, current: 2400 }
  };
  let count = 0, total = 0;
  Object.keys(defaults).forEach(key => {
    const saved = monsters[key];
    const current = saved ? Number(saved.currenthp) : defaults[key].current;
    const defeated = saved ? saved.defeated : false;
    if (!defeated && current > 0) {
      count++;
      total += current;
    }
  });
  return { count, total };
}

// ── Meses dos últimos 6 para o gráfico ───────────────
function getLast6Months() {
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const result = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ label: months[d.getMonth()], month: d.getMonth(), year: d.getFullYear() });
  }
  return result;
}

function getChartData(transactions) {
  const periods = getLast6Months();
  const incomes  = periods.map(p =>
    transactions.filter(t => {
      const d = new Date(t.date);
      return t.type==="income" && d.getMonth()===p.month && d.getFullYear()===p.year;
    }).reduce((s,t) => s+t.value, 0)
  );
  const expenses = periods.map(p =>
    transactions.filter(t => {
      const d = new Date(t.date);
      return t.type==="expense" && d.getMonth()===p.month && d.getFullYear()===p.year;
    }).reduce((s,t) => s+t.value, 0)
  );
  return { labels: periods.map(p => p.label), incomes, expenses };
}

// ── Renderizar atividade recente ─────────────────────
function renderActivity(transactions) {
  const container = document.getElementById("activityList");
  const recent = [...transactions].reverse().slice(0, 10);
  if (recent.length === 0) {
    container.innerHTML = '<p style="color:#888;text-align:center;padding:20px;">Nenhuma transação registrada.</p>';
    return;
  }
  container.innerHTML = recent.map(t => {
    const isIncome = t.type === "income";
    const sign = isIncome ? "+" : "-";
    const cls  = isIncome ? "positive" : "negative";
    const date = new Date(t.date).toLocaleDateString("pt-BR");
    return `
      <div class="activity-item">
        <div>
          <h4>${t.name}</h4>
          <span>${date} · ${t.category}</span>
        </div>
        <strong class="${cls}">${sign}R$${t.value.toLocaleString("pt-BR",{minimumFractionDigits:2})}</strong>
      </div>`;
  }).join("");
}

// ── XP ────────────────────────────────────────────────
function updateXP(transactions) {
  const xp    = transactions.length * 50;
  const level = Math.floor(xp / 500) + 1;
  const xpMax = level * 500;
  const pct   = Math.min(((xp % 500) / 500) * 100, 100);
  document.getElementById("xpCurrent").textContent = xp;
  document.getElementById("xpMax").textContent     = xpMax;
  document.getElementById("xpFill").style.width    = pct + "%";
  document.getElementById("playerClass").textContent = `Nível ${level} – ${getTitle(level)}`;
}

function getTitle(lvl) {
  if (lvl < 3)  return "Iniciante da Economia";
  if (lvl < 6)  return "Mago da Poupança";
  if (lvl < 10) return "Guardião das Finanças";
  return "Lorde da Riqueza";
}

// ── Missões ativas (reativas) ─────────────────────────
function renderQuests(transactions) {
  const income  = transactions.filter(t => t.type === "income").reduce((s,t) => s+t.value, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((s,t) => s+t.value, 0);
  const balance = income - expense;
  const savings = transactions.filter(t => t.category === "Poupança").reduce((s,t) => s+t.value, 0);
  const debtPay = transactions.filter(t => t.category === "Dívida").reduce((s,t) => s+t.value, 0);

  // Missão 1: quitar cartão (meta R$5000 pagos em dívidas)
  const q1pct = Math.min(Math.round((debtPay / 5000) * 100), 100);
  // Missão 2: guardar R$1000
  const q2pct = Math.min(Math.round((savings / 1000) * 100), 100);
  // Missão 3: ter pelo menos 5 gastos registrados
  const expCount = transactions.filter(t => t.type === "expense").length;
  const q3pct = Math.min(Math.round((expCount / 5) * 100), 100);

  const grid = document.querySelector(".quests-grid");
  if (!grid) return;
  grid.innerHTML = `
    <div class="quest-card">
      <h3>Quitar Cartão de Crédito</h3>
      <div class="quest-progress"><div class="quest-fill" style="width:${q1pct}%"></div></div>
      <span>${q1pct}% completo · +500 XP</span>
    </div>
    <div class="quest-card">
      <h3>Guardar R$1000 na Reserva</h3>
      <div class="quest-progress"><div class="quest-fill" style="width:${q2pct}%"></div></div>
      <span>${q2pct}% completo · +300 XP</span>
    </div>
    <div class="quest-card">
      <h3>Registrar 5 gastos</h3>
      <div class="quest-progress"><div class="quest-fill" style="width:${q3pct}%"></div></div>
      <span>${expCount}/5 registrados · +100 XP</span>
    </div>
  `;
}

// ── Atualizar tela ────────────────────────────────────
let chart = null;

function refreshDashboard() {
  const transactions = getTransactions();
  const { income, expense, balance } = calcSummary(transactions);
  const debts = calcDebtsSummary();

  document.getElementById("profileBalance").textContent =
    "R$" + balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  document.getElementById("totalIncome").textContent =
    "R$" + income.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  document.getElementById("totalExpenses").textContent =
    "R$" + expense.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  // Dívidas ativas dinâmico
  const debtCard = document.querySelector(".status-card.debts h2");
  const debtSub  = document.querySelector(".status-card.debts p");
  if (debtCard) debtCard.textContent = `${debts.count} Monstro${debts.count !== 1 ? "s" : ""}`;
  if (debtSub)  debtSub.textContent  = `Total: R$${debts.total.toLocaleString("pt-BR")}`;

  renderActivity(transactions);
  updateXP(transactions);
  renderQuests(transactions);

  // Gráfico
  const { labels, incomes, expenses } = getChartData(transactions);
  if (chart) {
    chart.data.labels           = labels;
    chart.data.datasets[0].data = incomes;
    chart.data.datasets[1].data = expenses;
    chart.update();
  } else {
    const ctx = document.getElementById("financeChart").getContext("2d");
    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "Receitas", data: incomes, backgroundColor: "rgba(87,199,119,0.75)", borderColor: "#57c777", borderWidth: 2 },
          { label: "Gastos",   data: expenses, backgroundColor: "rgba(255,91,0,0.75)",   borderColor: "#ff5b00", borderWidth: 2 }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: "#ddd" } } },
        scales: {
          x: { ticks: { color: "#aaa" }, grid: { color: "#333" } },
          y: { ticks: { color: "#aaa", callback: v => "R$" + v.toLocaleString("pt-BR") }, grid: { color: "#333" } }
        }
      }
    });
  }
}

// ── Modal helpers ─────────────────────────────────────
const quickModal = document.getElementById("quickModal");

function showPanel(id) {
  ["mainQuickActions","incomeForm","expenseForm"].forEach(pid => {
    document.getElementById(pid).style.display = pid === id ? "block" : "none";
  });
}

function openModal()  { quickModal.classList.add("active");    showPanel("mainQuickActions"); }
function closeModal() { quickModal.classList.remove("active"); showPanel("mainQuickActions"); }

// ── Event Listeners ───────────────────────────────────
document.getElementById("openQuickModal").addEventListener("click", openModal);
document.getElementById("closeQuickModal").addEventListener("click", closeModal);
quickModal.addEventListener("click", e => { if (e.target === quickModal) closeModal(); });
document.getElementById("openIncomeForm").addEventListener("click", () => showPanel("incomeForm"));
document.getElementById("backFromIncome").addEventListener("click", () => showPanel("mainQuickActions"));
document.getElementById("openExpenseForm").addEventListener("click", () => showPanel("expenseForm"));
document.getElementById("backFromExpense").addEventListener("click", () => showPanel("mainQuickActions"));
document.getElementById("goToArena").addEventListener("click", () => { window.location.href = "arena.html"; });

// Registrar Receita
document.getElementById("collectIncome").addEventListener("click", () => {
  const name     = document.getElementById("incomeName").value.trim();
  const value    = parseFloat(document.getElementById("incomeValue").value);
  const category = document.getElementById("incomeCategory").value;
  if (!name || isNaN(value) || value <= 0) { alert("Preencha todos os campos corretamente."); return; }
  const transactions = getTransactions();
  transactions.push({ type: "income", name, value, category, date: new Date().toISOString() });
  saveTransactions(transactions);
  document.getElementById("incomeName").value  = "";
  document.getElementById("incomeValue").value = "";
  closeModal();
  refreshDashboard();
  showToast(`+R$${value.toFixed(2)} de ${name} registrado! ✨`);
});

// Registrar Gasto
document.getElementById("registerExpense").addEventListener("click", () => {
  const name     = document.getElementById("expenseName").value.trim();
  const value    = parseFloat(document.getElementById("expenseValue").value);
  const category = document.getElementById("expenseCategory").value;
  if (!name || isNaN(value) || value <= 0) { alert("Preencha todos os campos corretamente."); return; }
  const transactions = getTransactions();
  transactions.push({ type: "expense", name, value, category, date: new Date().toISOString() });
  saveTransactions(transactions);
  document.getElementById("expenseName").value  = "";
  document.getElementById("expenseValue").value = "";
  closeModal();
  refreshDashboard();
  showToast(`-R$${value.toFixed(2)} de ${name} registrado! 🔥`);
});

// ── Toast ─────────────────────────────────────────────
function showToast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText = `position:fixed;bottom:30px;right:30px;z-index:9999;
    background:#252525;border:2px solid #ffd400;color:#ffd400;
    padding:14px 22px;font-family:monospace;font-size:15px;animation:fadeIn .3s ease;`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── Init ──────────────────────────────────────────────
showPanel("mainQuickActions");
refreshDashboard();
