// CONSTANTS SECTIONADDMODE
const APIURL = "http://localhost:5678/api/";
let TOKEN = "";
let LOGIN = false;

let WORKS_ARRAY = []; // used each time we click on the filter buttons
let EDIT_MODE = false;
let Add_MODE = false;

const FILTERS = document.querySelector(".filters");
const MAIN_GALLERY = document.querySelector(".main-gallery");
const DELETE_GALLERY = document.querySelector(".delete-gallery");

const ADD_FORM = document.getElementById("add-form");
const ORIGINAL_ADD_FORM = ADD_FORM.innerHTML;

// API SECTION
async function apiAuth() { // audit the token
  let auth = false;
  await fetch(APIURL + "users/auth", {
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

async function apiGet(endUrl) { // get the works/categories
  let data = "";
  await fetch(APIURL + endUrl, {})
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

async function apiDelete(id) { // remove one work from the database
  let res = false;
  await fetch(APIURL + "works/" + id, {
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

async function apiAdd(formData) { // add one work to the ddarabase
  let res = false;
  await fetch(APIURL + "works", {
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

// NAVIGATION SECTION
function addEventListenerNav() { // set all the event listeners for the navigation
  const modale = document.querySelector(".modale");
  modale.addEventListener("click", (e) => {
    modale == e.target ? editionMode() : null;
  });
  document.querySelector(".fa-xmark").addEventListener("click", () => {
    editionMode();
  });
  document.querySelector(".accessEditBtn").addEventListener("click", () => {
    editionMode();
  });
  document.querySelector(".fa-arrow-left").addEventListener("click", () => {
    addMode();
  });
  document.querySelector(".btn-addMode").addEventListener("click", () => {
    addMode();
  });
  document.querySelector(".logoutBtn").addEventListener("click", () => {
    LOGIN = false;
    logInOut();
  });
}

function editionMode() { // open or close the modale windows
  EDIT_MODE = EDIT_MODE ? false : true;
  document.querySelector(".modale").style.display = EDIT_MODE ? "flex" : "none";
  Add_MODE ? addMode() : null;
}

function addMode() { // open or close the form for add a work
  Add_MODE = Add_MODE ? false : true;
  document.querySelector(".delete-mode").style.display = Add_MODE ? "none" : "flex";
  document.querySelector(".add-mode").style.display = Add_MODE ? "flex" : "none";
  document.querySelector(".fa-arrow-left").style.visibility = Add_MODE ? "visible" : "hidden";
  Add_MODE ? null : refreshAddMode();
}

function logInOut() { // set the page depending on whether we are log or not
  document.querySelector(".loginBtn").style.display = LOGIN ? "none" : "block";
  document.querySelector(".filters").style.display = LOGIN ? "none" : "flex";
  document.querySelector(".logoutBtn").style.display = LOGIN ? "block" : "none";
  document.querySelector(".edition-banner").style.display = LOGIN ? "flex" : "none";
  document.querySelector(".accessEditBtn").style.display = LOGIN ? "flex" : "none";
  LOGIN ? null : localStorage.removeItem("token");
}

// FILTERS SECTION
async function setAllFilterBtn() { // add all the filters buttons
  const categoriesArray = await apiGet("categories");
  const allCaterories = {name: "Tous", id: 0};
  FILTERS.appendChild(filterBtn(allCaterories));
  for (const category of categoriesArray) {
    FILTERS.appendChild(filterBtn(category));
  }
}

function filterBtn(category) { // create one filter button
  const filtBtn = document.createElement("div");
  filtBtn.className = "btn";
  filtBtn.dataset.select = category.id == 0 ? true : false;
  filtBtn.dataset.id = category.id;
  const btnTxt = document.createElement("p");
  btnTxt.innerHTML = category.name;
  filtBtn.appendChild(btnTxt);
  return filtBtn;
}

function eventFilterBtn(btn) { // actions when we click on the filter buttons
  MAIN_GALLERY.innerHTML = "";
  addWorksToGallery(MAIN_GALLERY, btn.dataset.id);
  const oldBtn = MAIN_GALLERY.parentNode.querySelector("[data-select=true]");
  oldBtn.dataset.select = false;
  btn.dataset.select = true;
}

// GALLERIES SECTION
function refreshGaleries() { // refresh both galleries
  MAIN_GALLERY.innerHTML = "";
  DELETE_GALLERY.innerHTML = "";
  loadGaleries();
}

async function loadGaleries() { // load both galleries after getting the works
  WORKS_ARRAY = await apiGet("works");
  addWorksToGallery(MAIN_GALLERY);
  addWorksToGallery(DELETE_GALLERY);
}

function addWorksToGallery(gallery, categoryId = 0) { // add each work to the selected gallery depending of the category aimed
  for (const work of WORKS_ARRAY) {
    if (categoryId == work.categoryId || categoryId == 0) {
      gallery.appendChild(
        setWork(work, RegExp("main").test(gallery.className))
      );
    }
  }
}

function setWork(work, maingallery) { // create one work depending of the selected gallery
  const newWork = document.createElement("div");
  newWork.className = "work";
  const imgNewWork = document.createElement("img");
  imgNewWork.src = work.imageUrl;
  imgNewWork.alt = work.title;
  newWork.appendChild(imgNewWork);

  if (maingallery) {
    const imgTitle = document.createElement("p");
    imgTitle.innerHTML = work.title;
    newWork.appendChild(imgTitle);
  } else {
    newWork.appendChild(addDeleteBtn(work.id));
  }
  return newWork;
}

function addDeleteBtn(id) { // add the delete button on the work (only for delete gallery)
  const deleteBtn = document.createElement("d");
  deleteBtn.className = "btnTrashCan fa-solid fa-trash-can";
  deleteBtn.dataset.id = id;
  return deleteBtn;
}

// ADD SECTION
function setImageSelected(target) { // show the image when selected on the add mode
  if (target.files.length == 1) {
    const label = target.previousElementSibling;
    label.innerHTML = "";
    const imgAdd = document.createElement("img");
    imgAdd.src = URL.createObjectURL(target.files[0]);
    label.appendChild(imgAdd);
  }
}

function refreshAddMode() { // reset the form for add a work
  ADD_FORM.innerHTML = ORIGINAL_ADD_FORM;
  lockAddBtn(false);
}

function checkLockAddBtn() { // check if one value is empty inside the form
  let inputArray = ADD_FORM.querySelectorAll(".check-value");
  let check = false;
  inputArray.forEach((o) => {
    o.value ? null : (check = true);
  });
  lockAddBtn(check);
}

function lockAddBtn(check) { // lock (if true) unlock (if false) the submit button
  const submitBtn = ADD_FORM.querySelector("input[type='submit']");
  submitBtn.dataset.lock = check;
}

function addFormChangeEvent(e) { // actions when one value of the form is changing
  if (e.target.type == "file") {
    setImageSelected(e.target);
  }
  checkLockAddBtn();
}

function initFormData() { // create formData when we submit a new work
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const file = document.getElementById("file").files[0];

  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", file);

  return formData;
}

async function addFormSubmitEvent() { // actions when we submit a new work
  await apiAdd(initFormData()).then((r) => {
    if (r) {
      refreshGaleries();
      addMode();
    }
  });
}

// HTML GENERATION
setAllFilterBtn();
loadGaleries();

// EVENTS LISTENER GENERATION
ADD_FORM.addEventListener("input", (e) => {
  addFormChangeEvent(e);
});
ADD_FORM.addEventListener("submit", (e) => {
  e.preventDefault();
  addFormSubmitEvent();
});
DELETE_GALLERY.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btnTrashCan")) {
    await apiDelete(e.target.dataset.id).then((r) => {
      r ? refreshGaleries() : null;
    });
  }
});
FILTERS.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn")) {
    e.target.dataset.select == true
      ? console.log("Already selected!")
      : eventFilterBtn(e.target);
  }
});
addEventListenerNav();

// everything is ready....wait!! Are we login?
try {
  TOKEN = JSON.parse(localStorage.getItem("token")).token;
  //LOGIN = await apiAuth();
  LOGIN = true;
} catch (error) {
  console.log("No valid token found!");
}
logInOut();

/* !!!   
(redirection login>index si déjà log) */
