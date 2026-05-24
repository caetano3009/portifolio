const manaModal =
document.getElementById("manaModal");

const wellModal =
document.getElementById("wellModal");

const manaButtons =
document.querySelectorAll(".mana-btn");

const closeModal =
document.getElementById("closeModal");

const depositBtn =
document.getElementById("depositBtn");

const modalTitle =
document.getElementById("modalTitle");

const modalCurrent =
document.getElementById("modalCurrent");

const modalRemaining =
document.getElementById("modalRemaining");

const manaInput =
document.getElementById("manaInput");

const openWellModal =
document.getElementById("openWellModal");

const closeWellModal =
document.getElementById("closeWellModal");

const createWellBtn =
document.getElementById("createWellBtn");

const wellsGrid =
document.getElementById("wellsGrid");

let currentCard = null;

/* =========================
   OPEN ADD MANA
========================= */

manaButtons.forEach((button)=>{

  button.addEventListener("click",()=>{

    currentCard =
    button.closest(".well-card");

    const title =
    currentCard.querySelector("h3").innerText;

    const current =
    Number(currentCard.dataset.current);

    const target =
    Number(currentCard.dataset.target);

    const remaining =
    target - current;

    modalTitle.innerText =
    `ADICIONAR MANA EM ${title.toUpperCase()}`;

    modalCurrent.innerText =
    `Atual: $${current.toLocaleString("pt-BR")}`;

    modalRemaining.innerText =
    `Restante: $${remaining.toLocaleString("pt-BR")}`;

    manaModal.classList.add("active");

  });

});

/* =========================
   CLOSE
========================= */

closeModal.addEventListener("click",()=>{

  manaModal.classList.remove("active");

});

closeWellModal.addEventListener("click",()=>{

  wellModal.classList.remove("active");

});

/* =========================
   DEPOSIT
========================= */

depositBtn.addEventListener("click",()=>{

  if(!currentCard) return;

  const value =
  Number(manaInput.value);

  if(value <= 0) return;

  let current =
  Number(currentCard.dataset.current);

  const target =
  Number(currentCard.dataset.target);

  current += value;

  if(current > target){
    current = target;
  }

  const remaining =
  target - current;

  const percent =
  Math.floor((current / target) * 100);

  currentCard.dataset.current =
  current;

  currentCard.querySelector(".current-value")
  .innerText =
  `$${current.toLocaleString("pt-BR")}`;

  currentCard.querySelector(".remaining-value")
  .innerText =
  `$${remaining.toLocaleString("pt-BR")}`;

  currentCard.querySelector(".percent-text")
  .innerText =
  `${percent}%`;

  currentCard.querySelector(".visual-fill")
  .style.height =
  `${percent}%`;

  currentCard.querySelector(".small-fill")
  .style.width =
  `${percent}%`;

  manaModal.classList.remove("active");

});

/* =========================
   OPEN NEW WELL
========================= */

openWellModal.addEventListener("click",()=>{

  wellModal.classList.add("active");

});

/* =========================
   CREATE WELL
========================= */

createWellBtn.addEventListener("click",()=>{

  const goalName =
  document.getElementById("goalName").value;

  const goalAmount =
  document.getElementById("goalAmount").value;

  const goalDate =
  document.getElementById("goalDate").value;

  if(
    goalName === "" ||
    goalAmount === "" ||
    goalDate === ""
  ){
    return;
  }

  const card = document.createElement("div");

  card.className =
  "well-card purple-border";

  card.dataset.current = 0;
  card.dataset.target = goalAmount;

  card.innerHTML = `
  
    <div class="well-header">

      <div class="well-icon">
        <i class="bi bi-stars"></i>
      </div>

      <div>

        <h3>${goalName}</h3>

        <span>
          <i class="bi bi-calendar3"></i>
          ${goalDate}
        </span>

      </div>

    </div>

    <div class="well-visual">

      <div
        class="visual-fill"
        style="height:0%"
      ></div>

      <div class="percent-text">
        0%
      </div>

    </div>

    <div class="small-progress">

      <div
        class="small-fill"
        style="width:0%"
      ></div>

    </div>

    <div class="well-stats">

      <div class="stat-row">
        <span>Atual:</span>
        <strong class="purple current-value">
          $0
        </strong>
      </div>

      <div class="stat-row">
        <span>Meta:</span>
        <strong class="target-value">
          $${Number(goalAmount).toLocaleString("pt-BR")}
        </strong>
      </div>

      <div class="stat-row">
        <span>Restante:</span>
        <strong class="yellow remaining-value">
          $${Number(goalAmount).toLocaleString("pt-BR")}
        </strong>
      </div>

    </div>

    <button class="mana-btn">
      <i class="bi bi-gem"></i>
      ADICIONAR MANA
    </button>

  `;

  wellsGrid.appendChild(card);

  const newButton =
  card.querySelector(".mana-btn");

  newButton.addEventListener("click",()=>{

    currentCard = card;

    const target =
    Number(card.dataset.target);

    modalTitle.innerText =
    `ADICIONAR MANA EM ${goalName.toUpperCase()}`;

    modalCurrent.innerText =
    `Atual: $0`;

    modalRemaining.innerText =
    `Restante: $${target.toLocaleString("pt-BR")}`;

    manaModal.classList.add("active");

  });

  const activeWells =
  document.getElementById("activeWells");

  activeWells.innerText =
  Number(activeWells.innerText) + 1;

  wellModal.classList.remove("active");

});