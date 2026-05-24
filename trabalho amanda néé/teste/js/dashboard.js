const quickModal =
  document.getElementById("quickModal");


const openQuickModal =
  document.getElementById("openQuickModal");


const closeQuickModal =
  document.getElementById("closeQuickModal");


/* OPEN */
openQuickModal.addEventListener("click", () => {


  quickModal.classList.add("active");


});


/* CLOSE BUTTON */
closeQuickModal.addEventListener("click", () => {


  quickModal.classList.remove("active");


});


/* CLOSE OUTSIDE */
quickModal.addEventListener("click", (e) => {


  if(e.target === quickModal){


    quickModal.classList.remove("active");


  }


});


/* ACTIONS */
const incomeBtn =
  document.getElementById("incomeBtn");


const expenseBtn =
  document.getElementById("expenseBtn");


const debtBtn =
  document.getElementById("debtBtn");


incomeBtn.addEventListener("click", () => {


  alert("✨ Receita registrada com sucesso!");


  quickModal.classList.remove("active");


});


expenseBtn.addEventListener("click", () => {


  alert("🔥 Gasto registrado!");


  quickModal.classList.remove("active");


});


debtBtn.addEventListener("click", () => {


  window.location.href = "arena.html";


});


/* MODAL */


const actionModal =
document.getElementById("actionModal");


const floatingBtn =
document.querySelector(".floating-btn");


const closeModal =
document.getElementById("closeModal");


const openIncomeForm =
document.getElementById("openIncomeForm");


const backToActions =
document.getElementById("backToActions");


const mainActions =
document.getElementById("mainActions");


const incomeFormContainer =
document.getElementById("incomeFormContainer");


const collectGoldBtn =
document.getElementById("collectGoldBtn");


/* ABRIR */


floatingBtn.addEventListener("click",()=>{


  actionModal.classList.add("active");


});


/* FECHAR */


closeModal.addEventListener("click",()=>{


  actionModal.classList.remove("active");


});


/* FORM RECEITA */


openIncomeForm.addEventListener("click",()=>{


  mainActions.style.display = "none";


  incomeFormContainer.classList.add("active");


});


/* VOLTAR */


backToActions.addEventListener("click",()=>{


  incomeFormContainer.classList.remove("active");


  mainActions.style.display = "block";


});


/* COLETAR */


collectGoldBtn.addEventListener("click",()=>{


  const incomeName =
  document.getElementById("incomeName").value;


  const incomeValue =
  document.getElementById("incomeValue").value;


  const incomeCategory =
  document.getElementById("incomeCategory").value;


  if(
    incomeName === "" ||
    incomeValue === ""
  ){
    alert("Preencha todos os campos.");


    return;
  }


  alert(
    `+ R$${incomeValue} coletado!\nCategoria: ${incomeCategory}`
  );


  actionModal.classList.remove("active");


  incomeFormContainer.classList.remove("active");


  mainActions.style.display = "block";


});




