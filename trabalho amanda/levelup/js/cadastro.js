/* ======================================================
   LevelUp Finance – Cadastro JS
====================================================== */

const continueBtn  = document.getElementById("continueBtn");
const stepOne      = document.getElementById("stepOne");
const classSection = document.getElementById("classSection");
const classCards   = document.querySelectorAll(".class-card");

continueBtn.addEventListener("click", () => {
  const income = document.getElementById("monthlyIncome").value;
  if (!income || Number(income) <= 0) {
    alert("Informe sua renda mensal.");
    return;
  }
  localStorage.setItem("monthlyIncome", income);
  stepOne.classList.remove("active");
  classSection.classList.add("active");
});

classCards.forEach(card => {
  card.addEventListener("click", () => {
    const selectedClass = card.dataset.class;
    localStorage.setItem("playerClass", selectedClass);

    // Inicializar transação de receita inicial
    const income = Number(localStorage.getItem("monthlyIncome") || 0);
    if (income > 0) {
      const txs = JSON.parse(localStorage.getItem("transactions") || "[]");
      txs.push({
        type: "income",
        name: "Renda Inicial",
        value: income,
        category: "Trabalho",
        date: new Date().toISOString()
      });
      localStorage.setItem("transactions", JSON.stringify(txs));
    }

    // Salvar usuário como "registrado"
    const email = "player@levelup.finance";
    localStorage.setItem("registeredUser", JSON.stringify({ email, password: "levelup123", class: selectedClass }));

    window.location.href = "dashboard.html";
  });
});
