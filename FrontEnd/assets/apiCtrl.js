const URL = "http://localhost:5678/api/";
let TOKEN = "";
let LOGIN = false;

async function auth() { // audit the token
  let auth = false;
  await fetch(URL + "users/auth", {
    headers: {
      Authorization: "Bearer " + TOKEN,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      auth = data.auth;
    })
    .catch((error) => {
      console.error(error);
    });
  return auth;
}

async function get(endUrl) { // get the works/categories
  let data = "";
  await fetch(URL + endUrl, {})
    .then(async (response) => {
      if (response.ok) {
        data = await response.json();
      } else {
        console.log("error");
      }
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
  return data;
}

async function deleteWork(id) { // remove one work from the database
  let res = false;
  await fetch(URL + "works/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TOKEN,
    },
  })
    .then((response) => {
      response.ok ? (res = true) : console.log("error");
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
  return res;
}

async function addWork(formData) { // add one work to the ddarabase
  let res = false;
  await fetch(URL + "works", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + TOKEN,
    },
    body: formData,
  })
    .then((response) => {
      response.ok ? (res = true) : console.log("error");
    })
    .catch((error) => {
      console.error(error);
    });
  return res;
}

async function login(bodyJson) { // verify the form and redirect if ok, else show a error message
  await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: bodyJson,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.token) {
        const responseData = JSON.stringify(data);
        localStorage.setItem("token", responseData);
        window.location.href = "index.html";
      } else {
        alert("Identifiant ou mot de passe incorrect");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

try {
  TOKEN = JSON.parse(localStorage.getItem("token")).token;
  LOGIN = await auth();
} catch (error) {
  console.log("No valid token found!");
}

export let api = {
  auth: auth,
  get: get,
  delete: deleteWork,
  add: addWork,
  login: login,
  LOGIN: LOGIN,
};
