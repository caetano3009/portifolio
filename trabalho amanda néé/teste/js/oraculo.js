const checkboxes = document.querySelectorAll(".quest-card input");

checkboxes.forEach((checkbox) => {

  checkbox.addEventListener("change", () => {

    const card = checkbox.closest(".quest-card");

    if(checkbox.checked){

      card.classList.add("completed");

    }else{

      card.classList.remove("completed");

    }

  });

});