import {api} from "./apiCtrl.js";

const FORM = document.getElementById("form");

FORM.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const body = { email: email, password: password };
  const bodyJson = JSON.stringify(body);

  await api.login(bodyJson);
});

if (api.LOGIN) {
  window.location.href = "index.html";
}