const attackButtons =
  document.querySelectorAll(".attack-btn");

const attackModal =
  document.getElementById("attackModal");

const closeAttackModal =
  document.getElementById("closeAttackModal");

const confirmAttack =
  document.getElementById("confirmAttack");

const attackInput =
  document.getElementById("attackInput");

const attackTitle =
  document.getElementById("attackTitle");

const minimumDamage =
  document.getElementById("minimumDamage");

const currentHp =
  document.getElementById("currentHp");

let selectedMonster = null;

/* OPEN MODAL */
attackButtons.forEach((button) => {

  button.addEventListener("click", () => {

    selectedMonster = button;

    const monster =
      button.dataset.monster;

    const hp =
      button.dataset.currenthp;

    const minimum =
      button.dataset.minimum;

    attackTitle.innerText =
      `ATACAR ${monster.toUpperCase()}`;

    minimumDamage.innerText =
      `Dano mínimo: $${minimum}`;

    currentHp.innerText =
      `HP Atual: $${Number(hp).toLocaleString("pt-BR")}`;

    attackInput.value = minimum;

    attackModal.classList.add("active");

  });

});

/* CLOSE */
closeAttackModal.addEventListener("click", () => {

  attackModal.classList.remove("active");

});

/* CLOSE OUTSIDE */
attackModal.addEventListener("click", (e) => {

  if(e.target === attackModal){

    attackModal.classList.remove("active");

  }

});

/* ATTACK */
confirmAttack.addEventListener("click", () => {

  if(!selectedMonster) return;

  let currentMonsterHp =
    Number(selectedMonster.dataset.currenthp);

  const attackValue =
    Number(attackInput.value);

  const minimum =
    Number(selectedMonster.dataset.minimum);

  if(attackValue < minimum){

    alert(
      `⚠ O ataque mínimo é $${minimum}`
    );

    return;

  }

  currentMonsterHp -= attackValue;

  if(currentMonsterHp < 0){

    currentMonsterHp = 0;

  }

  /* SAVE NEW HP */
  selectedMonster.dataset.currenthp =
    currentMonsterHp;

  /* UPDATE TEXT */
  const hpText =
    document.querySelector(
      selectedMonster.dataset.hptext
    );

  hpText.innerText =
    `$${currentMonsterHp.toLocaleString("pt-BR")}`;

  /* UPDATE BAR */
  const fill =
    document.querySelector(
      selectedMonster.dataset.fill
    );

  let maxHp = 5000;

  if(selectedMonster.dataset.monster === "Hidra do Estudante"){

    maxHp = 15000;

  }

  if(selectedMonster.dataset.monster === "Fera do Financiamento"){

    maxHp = 8000;

  }

  const percentage =
    (currentMonsterHp / maxHp) * 100;

  fill.style.width =
    `${percentage}%`;

  /* MONSTER DEFEATED */
  if(currentMonsterHp === 0){

    selectedMonster.innerHTML = `
      <i class="bi bi-trophy-fill"></i>
      MONSTRO DERROTADO
    `;

    selectedMonster.style.background =
      "#29c76f";

    selectedMonster.disabled = true;

  }

  attackModal.classList.remove("active");

});