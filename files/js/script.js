// Credenciais de teste
const VALID_EMAIL    = "hero@levelup.finance";
const VALID_PASSWORD = "levelup123";

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const email    = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const errEl    = document.getElementById("loginError");

  // Aceita as credenciais de teste OU qualquer e-mail/senha cadastrados
  const registered = JSON.parse(localStorage.getItem("registeredUser") || "null");
  const valid =
    (email === VALID_EMAIL && password === VALID_PASSWORD) ||
    (registered && email === registered.email && password === registered.password);

  if (valid) {
    errEl.style.display = "none";
    window.location.href = "dashboard.html";
  } else {
    errEl.style.display = "block";
  }
});
