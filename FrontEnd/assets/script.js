// '!!!' restant?
console.log("nouvelle page");


// API SECTION
async function apiAuth() {
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
    return auth;
}

async function apiGet(endUrl){
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

async function apiDelete(id){
    await fetch(APIURL + 'works/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + TOKEN
        }
    })
    .then((response) => {
        if(!response.ok) {console.log("error")};
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
};

async function apiAdd(formData){
    await fetch(APIURL + 'works', {
        method: 'POST',
        headers: {          
            'Authorization': "Bearer " + TOKEN
        },
        body: formData})
    .then((response) => {
        if(!response.ok) {console.log("error")};
    })
    .catch((error) => {
        console.error(error);
    });
};


// NAVIGATION SECTION
function addNavEventListener(){
    const modale = document.querySelector('.modale'); 
    modale.addEventListener("click", (e)=>{if (modale == e.target){editionMode()}});
    document.querySelector('.fa-xmark').addEventListener("click", ()=>{editionMode()});
    document.querySelector('.editBtn').addEventListener("click", ()=>{editionMode()});
    document.querySelector('.fa-arrow-left').addEventListener("click", ()=>{addMode()});
    document.querySelector('.btn-addMode').addEventListener("click", ()=>{addMode()});
    document.querySelector('.logoutBtn').addEventListener("click", ()=>{LOGIN = false; logInOut()});    
};

function editionMode(){
    EDITMODE = EDITMODE? false : true;
    document.querySelector(".modale").style.display = EDITMODE?"flex":"none";
    if (ADDMODE) {addMode()};
};

function addMode(){
    ADDMODE = ADDMODE? false : true;
    document.querySelector(".delete-mode").style.display = ADDMODE?"none":"flex";
    document.querySelector(".add-mode").style.display = ADDMODE?"flex":"none";
    document.querySelector(".fa-arrow-left").style.visibility = ADDMODE?"visible":"hidden";
    if (!ADDMODE) {refreshAddMode()};
};

function logInOut(){
    document.querySelector(".loginBtn").style.display = LOGIN?"none":"block";
    document.querySelector(".categories").style.display = LOGIN?"none":"flex";
    document.querySelector(".logoutBtn").style.display = LOGIN?"block":"none";
    document.querySelector(".edition-banner").style.display = LOGIN?"flex":"none";
    document.querySelector(".editBtn").style.display = LOGIN?"flex":"none";
    if (!LOGIN) {localStorage.removeItem("token")};
};


// FILTERS SECTION
function createAllFilterBtn(){
    const filtersDiv = document.createElement("div");
	filtersDiv.className = "categories";
    const allCaterories = {name: "Tous", id: 0};
    filtersDiv.appendChild(filterBtn(allCaterories));
    for (const category of CATEGORIESARRAY){
        filtersDiv.appendChild(filterBtn(category));
    };
    return filtersDiv;
};

function filterBtn(category){
    const filtBtn = document.createElement("div");
    filtBtn.className = "btn";
    if (category.id == 0){filtBtn.dataset.select = true};
    filtBtn.dataset.id = category.id;
    const btnTxt = document.createElement("p");
    btnTxt.innerHTML = category.name;
    filtBtn.appendChild(btnTxt);
    filtBtn.addEventListener("click", ()=>{filtBtn.dataset.select == true? console.log("Already selected!"):eventFilterBtn(filtBtn)});
    return filtBtn;
};

function eventFilterBtn(btn){
    MAINGALLERY.innerHTML = '';
    addWorksToGallery(MAINGALLERY, btn.dataset.id);
    const oldBtn = MAINGALLERY.parentNode.querySelector('[data-select=true]');
    oldBtn.dataset.select = false;
    btn.dataset.select = true;
};


// GALLERIES SECTION
function refreshGaleries(){
    MAINGALLERY.innerHTML = '';
    DELETEGALLERY.innerHTML = '';
    loadGaleries();
};

async function loadGaleries(){
    WORKSARRAY = await apiGet("works");
    addWorksToGallery(MAINGALLERY);
    addWorksToGallery(DELETEGALLERY);
};

function addWorksToGallery(gallery, categoryId = 0){
    for (const work of WORKSARRAY){
        if (categoryId == work.categoryId || categoryId == 0){
            gallery.appendChild(setWork(work, RegExp("main").test(gallery.className)))
        };
    };
};

function setWork(work, maingallery){
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
        newWork.appendChild(addDeleteBtn(work.id));
    };
    return newWork;
};

function addDeleteBtn(id){
    const deleteBtn = document.createElement("div");
    deleteBtn.className = "btnTrashCan";
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-trash-can";
    deleteBtn.appendChild(icon);
    deleteBtn.addEventListener("click" , async (e) => {
        e.preventDefault();
        await apiDelete(id);
        refreshGaleries();
    });
    return deleteBtn
};


// ADD SECTION
function setImageSelected(target){
    if (target.files.length == 1) {
        const label = target.previousElementSibling;
        label.innerHTML = '';
        const imgAdd = document.createElement("img");
        imgAdd.src = URL.createObjectURL(target.files[0])
        label.appendChild(imgAdd);
    };
};

function refreshAddMode(){
    ADD_FORM.innerHTML = ORIGINAL_ADD_FORM;
    lockAddBtn(false);
};

function checkLockAddBtn(){
    let values = document.querySelectorAll(".check-value");
    let check = true;
    values.forEach((o)=>{if (!o.value){check = false}});
    lockAddBtn(check);
};

function lockAddBtn(check){
    const submitBtn = document.querySelector("#add-submit");
    submitBtn.style.backgroundColor = check?"#1D6154":"grey";
    submitBtn.style.borderColor = check?"#1D6154":"grey";
    submitBtn.style.cursor = check? "pointer" : "auto";
    submitBtn.style.pointerEvents = check? "all" : "none";
};

function addFormChangeEvent(e){
    if(e.target.type=="file"){
        setImageSelected(e.target)
    };
    checkLockAddBtn();
};

async function addFormSubmitEvent(){
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const file = document.getElementById('file').files[0];
    
    const formData  = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", file);

    await apiAdd(formData);
    console.log("on viens d'ajouter?");
    refreshGaleries();
    addMode();
};

// CONSTANTS SECTION
const APIURL = "http://localhost:5678/api/";
let TOKEN = '';
let LOGIN = false;

const CATEGORIESARRAY = await apiGet("categories"); // for avoid the async function inside other functions
let WORKSARRAY = []; // used each time we click on the filter buttons
let EDITMODE = false;
let ADDMODE = false;

const MAINGALLERY = document.querySelector(".main-gallery");
const DELETEGALLERY = document.querySelector(".delete-gallery");

const ADD_FORM = document.getElementById('add-form');
const ORIGINAL_ADD_FORM = ADD_FORM.innerHTML;
lockAddBtn(false);

// HTML GENERATION
MAINGALLERY.parentNode.insertBefore(createAllFilterBtn(), MAINGALLERY.previousSibling);
loadGaleries();

// EVENTS LISTENER GENERATION
ADD_FORM.addEventListener("input", (e) => {addFormChangeEvent(e)});
ADD_FORM.addEventListener('submit', (e)=>{e.preventDefault(); addFormSubmitEvent();});
addNavEventListener();
// addDeleteEvent?
// addFilterEvent?

// everything is ready....wait!! Are we login? 
try {
    TOKEN = JSON.parse(localStorage.getItem("token")).token;
    LOGIN = await apiAuth();
}catch(error){console.log("No token found!")};
logInOut();



/* !!!   
 peaufiner le css (surtout les boutons) 
 vérifier le bon fonctionnement des requete API
 commenter les fonctions
(redirection login>index si déjà log) */