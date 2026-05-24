/* ======================================================
   LevelUp Finance – Dashboard JS
   Gerencia transações, gráfico e interface
====================================================== */

// ── Helpers de localStorage ──────────────────────────
function getTransactions() {
  return JSON.parse(localStorage.getItem("transactions") || "[]");
}
function saveTransactions(list) {
  localStorage.setItem("transactions", JSON.stringify(list));
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
        <strong class="${cls}">${sign}$${t.value.toLocaleString("pt-BR",{minimumFractionDigits:2})}</strong>
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

// ── Atualizar tela ────────────────────────────────────
let chart = null;

function refreshDashboard() {
  const transactions = getTransactions();
  const { income, expense, balance } = calcSummary(transactions);

  document.getElementById("profileBalance").textContent =
    "$" + balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  document.getElementById("totalIncome").textContent =
    "$" + income.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  document.getElementById("totalExpenses").textContent =
    "$" + expense.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  renderActivity(transactions);
  updateXP(transactions);

  // Gráfico
  const { labels, incomes, expenses } = getChartData(transactions);

  if (chart) {
    chart.data.labels        = labels;
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
          {
            label: "Receitas",
            data: incomes,
            backgroundColor: "rgba(87,199,119,0.75)",
            borderColor: "#57c777",
            borderWidth: 2
          },
          {
            label: "Gastos",
            data: expenses,
            backgroundColor: "rgba(255,91,0,0.75)",
            borderColor: "#ff5b00",
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: "#ddd" } }
        },
        scales: {
          x: { ticks: { color: "#aaa" }, grid: { color: "#333" } },
          y: { ticks: { color: "#aaa" }, grid: { color: "#333" } }
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

  if (!name || isNaN(value) || value <= 0) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const transactions = getTransactions();
  transactions.push({ type: "income", name, value, category, date: new Date().toISOString() });
  saveTransactions(transactions);

  document.getElementById("incomeName").value  = "";
  document.getElementById("incomeValue").value = "";

  closeModal();
  refreshDashboard();
  showToast(`+$${value.toFixed(2)} de ${name} registrado! ✨`);
});

// Registrar Gasto
document.getElementById("registerExpense").addEventListener("click", () => {
  const name     = document.getElementById("expenseName").value.trim();
  const value    = parseFloat(document.getElementById("expenseValue").value);
  const category = document.getElementById("expenseCategory").value;

  if (!name || isNaN(value) || value <= 0) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const transactions = getTransactions();
  transactions.push({ type: "expense", name, value, category, date: new Date().toISOString() });
  saveTransactions(transactions);

  document.getElementById("expenseName").value  = "";
  document.getElementById("expenseValue").value = "";

  closeModal();
  refreshDashboard();
  showToast(`-$${value.toFixed(2)} de ${name} registrado! 🔥`);
});

// ── Toast ─────────────────────────────────────────────
function showToast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText = `
    position:fixed;bottom:30px;right:30px;z-index:9999;
    background:#252525;border:2px solid #ffd400;color:#ffd400;
    padding:14px 22px;font-family:monospace;font-size:15px;
    animation:fadeIn .3s ease;
  `;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── Init ──────────────────────────────────────────────
showPanel("mainQuickActions");
refreshDashboard();
