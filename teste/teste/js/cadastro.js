const continueBtn =
document.getElementById("continueBtn");

const stepOne =
document.getElementById("stepOne");

const classSection =
document.getElementById("classSection");

const classCards =
document.querySelectorAll(".class-card");

/* STEP */

continueBtn.addEventListener("click",()=>{

  const income =
  document.getElementById("monthlyIncome").value;

  if(income === ""){
    return;
  }

  stepOne.classList.remove("active");

  classSection.classList.add("active");

});

/* CLASS */

classCards.forEach((card)=>{

  card.addEventListener("click",()=>{

    const selectedClass =
    card.dataset.class;

    localStorage.setItem(
      "playerClass",
      selectedClass
    );

    window.location.href =
    "dashboard.html";

  });

});