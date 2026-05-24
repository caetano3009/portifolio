/* ======================================================
   LevelUp Finance – Oráculo JS (VERSÃO FUNCIONAL)
   Todos os insights e métricas baseados em dados reais
====================================================== */

const TXS_KEY    = "luf_transactions";
const QUESTS_KEY = "luf_quests";

// ── Missões ───────────────────────────────────────────
function loadQuestState() {
  return JSON.parse(localStorage.getItem(QUESTS_KEY) || "{}");
}
function saveQuestState(state) {
  localStorage.setItem(QUESTS_KEY, JSON.stringify(state));
}

function initQuests() {
  const state = loadQuestState();
  const checkboxes = document.querySelectorAll(".quest-card input[type=checkbox]");
  checkboxes.forEach(cb => {
    const card = cb.closest(".quest-card");
    const key  = "quest_" + card.querySelector("strong").innerText;
    if (state[key]) {
      cb.checked = true;
      card.classList.add("completed");
    }
    cb.addEventListener("change", () => {
      const s = loadQuestState();
      if (cb.checked) {
        card.classList.add("completed");
        s[key] = true;
        showToast("+XP ganho pela missão! 🏆");
      } else {
        card.classList.remove("completed");
        delete s[key];
      }
      saveQuestState(s);
      updateXPDisplay();
    });
  });
  updateXPDisplay();
}

function updateXPDisplay() {
  const completed = document.querySelectorAll(".quest-card.completed").length;
  const total     = document.querySelectorAll(".quest-card").length;
  const xpEl = document.querySelector(".quest-top span");
  if (xpEl) {
    const remaining = (total - completed) * 150;
    xpEl.textContent = `${remaining} XP disponíveis`;
  }
}

// ── Insights dinâmicos ────────────────────────────────
function buildInsights() {
  const txs = JSON.parse(localStorage.getItem(TXS_KEY) || "[]");
  
  const now   = new Date();
  const month = now.getMonth();
  const year  = now.getFullYear();
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear  = month === 0 ? year - 1 : year;

  const thisMonthTxs  = txs.filter(t => { const d = new Date(t.date); return d.getMonth()===month && d.getFullYear()===year; });
  const lastMonthTxs  = txs.filter(t => { const d = new Date(t.date); return d.getMonth()===prevMonth && d.getFullYear()===prevYear; });

  const income    = txs.filter(t => t.type==="income").reduce((s,t)=>s+t.value,0);
  const expense   = txs.filter(t => t.type==="expense").reduce((s,t)=>s+t.value,0);
  const balance   = income - expense;
  const saveRate  = income > 0 ? Math.round((balance / income) * 100) : 0;

  const thisExp   = thisMonthTxs.filter(t=>t.type==="expense").reduce((s,t)=>s+t.value,0);
  const lastExp   = lastMonthTxs.filter(t=>t.type==="expense").reduce((s,t)=>s+t.value,0);
  const expChange = lastExp > 0 ? Math.round(((thisExp - lastExp) / lastExp) * 100) : 0;

  const thisInc   = thisMonthTxs.filter(t=>t.type==="income").reduce((s,t)=>s+t.value,0);
  const lastInc   = lastMonthTxs.filter(t=>t.type==="income").reduce((s,t)=>s+t.value,0);

  // Atualizar Sabedoria Antiga
  const wisdomCards = document.querySelectorAll(".wisdom-card");
  
  if (wisdomCards[0]) {
    const h3 = wisdomCards[0].querySelector("h3");
    const p  = wisdomCards[0].querySelector("p");
    if (h3) h3.textContent = expChange >= 0 ? `↑ ${expChange}%` : `↓ ${Math.abs(expChange)}%`;
    if (p)  p.textContent  = expChange === 0 ? "igual ao mês passado" : expChange > 0 ? "vs. mês passado" : "vs. mês passado";
  }

  if (wisdomCards[1]) {
    const h3 = wisdomCards[1].querySelector("h3");
    const p  = wisdomCards[1].querySelector("p");
    if (h3) h3.textContent = saveRate + "%";
    if (p)  p.textContent  = saveRate >= 20 ? "Acima da média! 🏆" : saveRate >= 10 ? "Em progresso" : "Precisa melhorar";
  }

  // Streak de missões
  const questState = loadQuestState();
  const completedCount = Object.keys(questState).filter(k => questState[k]).length;
  if (wisdomCards[2]) {
    const h3 = wisdomCards[2].querySelector("h3");
    const p  = wisdomCards[2].querySelector("p");
    if (h3) h3.textContent = completedCount + " missão" + (completedCount !== 1 ? "ões" : "");
    if (p)  p.textContent  = completedCount > 0 ? "Completas! Continue assim!" : "Complete missões para XP";
  }

  // Atualizar insights cards
  const insightCards = document.querySelectorAll(".insight-card p");
  if (insightCards[0]) {
    if (txs.length === 0) {
      insightCards[0].innerHTML = `<i class="bi bi-info-circle"></i> Registre receitas e gastos no Hub para ver insights personalizados aqui.`;
    } else if (expChange > 20) {
      insightCards[0].innerHTML = `<i class="bi bi-exclamation-triangle"></i> Atenção: seus gastos este mês estão ${expChange}% maiores que no mês passado. Essa tendência está drenando seu HP financeiro.`;
    } else if (expChange < -10) {
      insightCards[0].innerHTML = `<i class="bi bi-graph-up-arrow"></i> Ótimo trabalho! Seus gastos caíram ${Math.abs(expChange)}% em relação ao mês passado.`;
    } else {
      insightCards[0].innerHTML = `<i class="bi bi-bar-chart"></i> Seus gastos este mês: R$${thisExp.toLocaleString("pt-BR",{minimumFractionDigits:2})}. ${expChange === 0 || lastExp === 0 ? "Sem dados do mês passado para comparar." : `Variação de ${expChange}% vs. mês anterior.`}`;
    }
  }

  if (insightCards[1] && income > 0) {
    if (saveRate >= 30) {
      insightCards[1].innerHTML = `<i class="bi bi-trophy"></i> Excelente! Você está economizando ${saveRate}% da sua renda. Continue assim e alcance a liberdade financeira!`;
    } else if (saveRate >= 10) {
      insightCards[1].innerHTML = `<i class="bi bi-graph-up-arrow"></i> Você economiza ${saveRate}% da sua renda. O ideal é 20%+. Tente reduzir gastos não essenciais.`;
    } else {
      insightCards[1].innerHTML = `<i class="bi bi-exclamation-triangle"></i> Taxa de economia atual: ${saveRate}%. Considere revisar seus gastos para aumentar sua reserva.`;
    }
  }

  if (insightCards[2]) {
    const debtPayments = txs.filter(t=>t.category==="Dívida").reduce((s,t)=>s+t.value,0);
    if (debtPayments > 0) {
      insightCards[2].innerHTML = `<i class="bi bi-trophy"></i> Você já quitou R$${debtPayments.toLocaleString("pt-BR",{minimumFractionDigits:2})} em dívidas! Cada ataque conta. Continue na Arena!`;
    } else {
      insightCards[2].innerHTML = `<i class="bi bi-lightning-charge"></i> Visite a Arena para atacar suas dívidas. Cada pagamento registrado gera XP e melhora sua saúde financeira!`;
    }
  }

  if (insightCards[3] && txs.length >= 5) {
    const categories = {};
    txs.filter(t=>t.type==="expense").forEach(t => { categories[t.category] = (categories[t.category]||0) + t.value; });
    const top = Object.entries(categories).sort((a,b)=>b[1]-a[1])[0];
    if (top) {
      insightCards[3].innerHTML = `<i class="bi bi-bar-chart-fill"></i> Sua maior categoria de gasto é <strong>${top[0]}</strong> com R$${top[1].toLocaleString("pt-BR",{minimumFractionDigits:2})}. Analise se há margem para reduzir.`;
    }
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

// Init
initQuests();
buildInsights();
