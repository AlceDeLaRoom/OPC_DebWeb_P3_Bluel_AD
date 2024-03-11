// CONSTANTS SECTION
const APIURL = "http://localhost:5678/api/";
let TOKEN = '';
let LOGIN = false;

let WORKSARRAY = []; // used each time we click on the filter buttons
let EDITMODE = false;
let ADDMODE = false;

const FILTERS = document.querySelector(".filters");
const MAINGALLERY = document.querySelector(".main-gallery");
const DELETEGALLERY = document.querySelector(".delete-gallery");

const ADD_FORM = document.getElementById('add-form');
const ORIGINAL_ADD_FORM = ADD_FORM.innerHTML;

// API SECTION
async function apiAuth() { // audit the token 
    let auth = false;
    await fetch(APIURL + "users/auth", {
        headers: {
            'Authorization': "Bearer " + TOKEN
        }
    })
    .then((response) => response.json())
    .then((data) => {auth = data.auth})
    .catch((error) => {
        console.error(error);
    });
    return auth
}

async function apiGet(endUrl){ // get the works/categories
    let data ='';
    await fetch(APIURL + endUrl, {})
    .then(async (response) => {
        if(response.ok) {
            data = await response.json()
        }else{
            console.log("error")
        };
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
    return data;
};

async function apiDelete(id){ // remove one work from the database
    let res = false;
    await fetch(APIURL + 'works/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + TOKEN
        }
    })
    .then((response) => {
        response.ok? res = true : console.log("error");
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
    return res
};

async function apiAdd(formData){ // add one work to the ddarabase
    let res = false;
    await fetch(APIURL + 'works', {
        method: 'POST',
        headers: {          
            'Authorization': "Bearer " + TOKEN
        },
        body: formData})
    .then((response) => {
        response.ok? res = true : console.log("error");
    })
    .catch((error) => {
        console.error(error);
    });
    return res
};

// NAVIGATION SECTION
function addEventListenerNav(){ // set all the event listeners for the navigation
    const modale = document.querySelector('.modale'); 
    modale.addEventListener("click", (e)=>{if (modale == e.target){editionMode()}});
    document.querySelector('.fa-xmark').addEventListener("click", ()=>{editionMode()});
    document.querySelector('.editBtn').addEventListener("click", ()=>{editionMode()});
    document.querySelector('.fa-arrow-left').addEventListener("click", ()=>{addMode()});
    document.querySelector('.btn-addMode').addEventListener("click", ()=>{addMode()});
    document.querySelector('.logoutBtn').addEventListener("click", ()=>{LOGIN = false; logInOut()});    
};

function editionMode(){ // open or close the modale windows
    EDITMODE = EDITMODE? false : true;
    document.querySelector(".modale").style.display = EDITMODE?"flex":"none";
    if (ADDMODE) {addMode()};
};

function addMode(){ // open or close the form for add a work
    ADDMODE = ADDMODE? false : true;
    document.querySelector(".delete-mode").style.display = ADDMODE?"none":"flex";
    document.querySelector(".add-mode").style.display = ADDMODE?"flex":"none";
    document.querySelector(".fa-arrow-left").style.visibility = ADDMODE?"visible":"hidden";
    if (!ADDMODE) {refreshAddMode()};
};

function logInOut(){ // set the page depending on whether we are log or not
    document.querySelector(".loginBtn").style.display = LOGIN?"none":"block";
    document.querySelector(".filters").style.display = LOGIN?"none":"flex";
    document.querySelector(".logoutBtn").style.display = LOGIN?"block":"none";
    document.querySelector(".edition-banner").style.display = LOGIN?"flex":"none";
    document.querySelector(".editBtn").style.display = LOGIN?"flex":"none";
    if (!LOGIN) {localStorage.removeItem("token")};
};

// FILTERS SECTION
async function setAllFilterBtn(){ // add all the filters buttons
    const categoriesArray = await apiGet("categories");
    const allCaterories = {name: "Tous", id: 0};
    FILTERS.appendChild(filterBtn(allCaterories));
    for (const category of categoriesArray){
        FILTERS.appendChild(filterBtn(category));
    };
};

function filterBtn(category){ // create one filter button
    const filtBtn = document.createElement("div");
    filtBtn.className = "btn";
    if (category.id == 0){filtBtn.dataset.select = true};
    filtBtn.dataset.id = category.id;
    const btnTxt = document.createElement("p");
    btnTxt.innerHTML = category.name;
    filtBtn.appendChild(btnTxt);
    return filtBtn;
};

function eventFilterBtn(btn){ // actions when we click on the filter buttons
    MAINGALLERY.innerHTML = '';
    addWorksToGallery(MAINGALLERY, btn.dataset.id);
    const oldBtn = MAINGALLERY.parentNode.querySelector('[data-select=true]');
    oldBtn.dataset.select = false;
    btn.dataset.select = true;
};

// GALLERIES SECTION
function refreshGaleries(){ // refresh both galleries
    MAINGALLERY.innerHTML = '';
    DELETEGALLERY.innerHTML = '';
    loadGaleries();
};

async function loadGaleries(){ // load both galleries after getting the works
    WORKSARRAY = await apiGet("works")
    addWorksToGallery(MAINGALLERY);
    addWorksToGallery(DELETEGALLERY);
};

function addWorksToGallery(gallery, categoryId = 0){ // add each work to the selected gallery depending of the category aimed
    for (const work of WORKSARRAY){
        if (categoryId == work.categoryId || categoryId == 0){
            gallery.appendChild(setWork(work, RegExp("main").test(gallery.className)))
        };
    };
};

function setWork(work, maingallery){ // create one work depending of the selected gallery
    const newWork = document.createElement("div");
    newWork.className = "work";
    const imgNewWork = document.createElement("img");
    imgNewWork.src = work.imageUrl;
    imgNewWork.alt = work.title;
    newWork.appendChild(imgNewWork);

    if (maingallery){
        const imgTitle = document.createElement("p");
        imgTitle.innerHTML = work.title;
        newWork.appendChild(imgTitle);
    }
    else{
        newWork.appendChild(addDeleteBtn(work.id +10));
    };
    return newWork;
};

function addDeleteBtn(id){ // add the delete button on the work (only for delete gallery)
    const deleteBtn = document.createElement("d");
    deleteBtn.className = "btnTrashCan fa-solid fa-trash-can";
    deleteBtn.dataset.id = id;
    return deleteBtn;
};

// ADD SECTION
function setImageSelected(target){ // show the image when selected on the add mode
    if (target.files.length == 1) {
        const label = target.previousElementSibling;
        label.innerHTML = '';
        const imgAdd = document.createElement("img");
        imgAdd.src = URL.createObjectURL(target.files[0])
        label.appendChild(imgAdd);
    };
};

function refreshAddMode(){ // reset the form for add a work 
    ADD_FORM.innerHTML = ORIGINAL_ADD_FORM;
    lockAddBtn(false);
};

function checkLockAddBtn(){ // check if one value is empty inside the form
    let values = ADD_FORM.querySelectorAll(".check-value");
    let check = true;
    values.forEach((o)=>{if (!o.value){check = false}});
    lockAddBtn(check);
};

function lockAddBtn(check){ // lock (if true) unlock (if false) the submit button 
    const submitBtn = document.querySelector("#add-submit");
    submitBtn.style.backgroundColor = check?"#1D6154":"grey";
    submitBtn.style.borderColor = check?"#1D6154":"grey";
    submitBtn.style.cursor = check? "pointer" : "auto";
    submitBtn.style.pointerEvents = check? "all" : "none";
};

function addFormChangeEvent(e){ // actions when one value of the form is changing
    if(e.target.type=="file"){
        setImageSelected(e.target)
    };
    checkLockAddBtn();
};

function initFormData(){ // create formData when we submit a new work
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const file = document.getElementById('file').files[0];
    
    const formData  = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", file);

    return formData
}

async function addFormSubmitEvent(){ // actions when we submit a new work

    await apiAdd(initFormData())
    .then((r)=>{
        if (r){
            refreshGaleries();
            addMode();
        };
    });
};

// HTML GENERATION
setAllFilterBtn();
loadGaleries();

// EVENTS LISTENER GENERATION
ADD_FORM.addEventListener("input", (e) => {addFormChangeEvent(e)});
ADD_FORM.addEventListener('submit', (e)=>{e.preventDefault(); addFormSubmitEvent();});
addEventListenerNav();
DELETEGALLERY.addEventListener("click" , async (e) => {if(e.target.classList.contains("btnTrashCan")){
    await apiDelete(e.target.dataset.id)
    .then((r)=>{ r ? refreshGaleries() : null});
}});
FILTERS.addEventListener("click", (e)=>{
    if(e.target.classList.contains("btn")){
        e.target.dataset.select == true? console.log("Already selected!"):eventFilterBtn(e.target)
    };
});

// everything is ready....wait!! Are we login? 
try {
    TOKEN = JSON.parse(localStorage.getItem("token")).token;
    LOGIN = await apiAuth();
}catch(error){console.log("No token found!")};
logInOut();



/* !!!   
 peaufiner le css (surtout les boutons) 
(redirection login>index si déjà log) */