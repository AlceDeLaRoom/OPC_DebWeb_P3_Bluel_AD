// '!!!' restant?
console.log("nouvelle page");


/* API SECTION */
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
    .then(response => {
        if (response.ok) {refreshGaleries()} // !!! 
        console.log(response);
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
        if(response.ok) {
            refreshGaleries()
        }else{
            console.log("error")
        }
    })
    .catch((error) => {
        console.error(error);
    });
};


/* NAVIGATION SECTION */
function addNavEvent(){
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


/* FILTERS SECTION */
function createAllFilterBtn(){
    const filtersDiv = document.createElement("div");
	filtersDiv.className = "categories";
    filtersDiv.appendChild(filterBtn("Tous", " selected"));
    for (const category of CATEGORIESARRAY){
        filtersDiv.appendChild(filterBtn(category.name));
    };
    return filtersDiv;
};

function filterBtn(categorie, selectedBtn = ""){
    const btnCat = document.createElement("div");
    btnCat.className = "btn" + selectedBtn;
    const txtBtn = document.createElement("p");
    txtBtn.innerHTML = categorie;
    btnCat.appendChild(txtBtn);
    btnCat.addEventListener("click", ()=>{/selected/.test(btnCat.className)? console.log("Already selected!"):eventFilterBtn(btnCat)});
    return btnCat;
};

function eventFilterBtn(btn){
    MAINGALLERY.innerHTML = '';
    addWorksToGallery(btn.firstChild.innerHTML);
    const oldBtn = MAINGALLERY.parentNode.querySelector(".selected");
    oldBtn.className = "btn";
    btn.className += " selected";
};


/* GALLERIES SECTION */
function refreshGaleries(){
    MAINGALLERY.innerHTML = '';
    DELETEGALLERY.innerHTML = '';
    loadGaleries();
};

async function loadGaleries(){
    WORKSARRAY = await apiGet("works");
    addWorksToGallery();
    addWorksToGallery("Tous", DELETEGALLERY);
};

function addWorksToGallery(category = "Tous" , contenor = MAINGALLERY){ // !!! retravailler cette fonction, utiliser les id des catégories
    if (/Tous/.test(category)) {
        for (const cat of CATEGORIESARRAY){
            addWorksToGallery(cat.name, contenor);
        }
    }
    else{
        category = category.replace(/&amp;/g,"&");
        const title = RegExp("delete").test(contenor.className)? false : true;
        for (const work of WORKSARRAY){
            if (RegExp(category).test(work.category.name)){
                contenor.appendChild(showOnework(work, title));
            };
        };
    };
};

function showOnework(work, title = true){
    const newWork = document.createElement("div");
    newWork.className = "work";
    const imgNewWork = document.createElement("img");
    imgNewWork.src = work.imageUrl;
    imgNewWork.alt = work.title;
    newWork.appendChild(imgNewWork);

    if (title){ // add title for main gallery 
        const imgTitle = document.createElement("p");
        imgTitle.innerHTML = work.title;
        newWork.appendChild(imgTitle);
    }
    else{ // add delete button for modale gallery
        newWork.appendChild(createDeleteBtn(work.id));
    };
    return newWork;
};

function createDeleteBtn(id){
    const deleteBtn = document.createElement("div");
    deleteBtn.className = "btnTrashCan";
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-trash-can";
    deleteBtn.appendChild(icon);
    deleteBtn.addEventListener("click" , async (e) => {
        e.preventDefault();
        await apiDelete(id);
    });
    return deleteBtn
};


/* ADD SECTION */
function setImageSelected(){
    if (inputAdd.files.length == 1) {
        labelAdd.innerHTML = '';
        const imgAdd = document.createElement("img");
        imgAdd.src = URL.createObjectURL(inputAdd.files[0])
        labelAdd.appendChild(imgAdd);
    };
};

function noImageSelected(){
    
};

function refreshAddMode(){
    // !!!
};

function lockBtnAdd(){
     // !!!
};

/* CONSTANTS SECTION */

const APIURL = "http://localhost:5678/api/";
let TOKEN = '';
let LOGIN = false;
try {
    TOKEN = JSON.parse(localStorage.getItem("token")).token;
    LOGIN = await apiAuth();
}catch(error){console.log("No token found!")};


let WORKSARRAY = [];
const CATEGORIESARRAY = await apiGet("categories");
let EDITMODE = false;
let ADDMODE = false;

const MAINGALLERY = document.querySelector(".gallery");
const DELETEGALLERY = document.querySelector(".delete-gallery");

const inputAdd = document.querySelector("#file");
const labelAdd = document.querySelector(".file");
const addForm = document.getElementById('add-form');

/* GENERATION HTML*/
MAINGALLERY.parentNode.insertBefore(createAllFilterBtn(), MAINGALLERY.previousSibling);
loadGaleries();

/* ADD EVENTS SECTION */

inputAdd.addEventListener("change", () => {setImageSelected()});
addForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const file = document.getElementById('file').files[0];
    
    const formData  = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", file);

    await apiAdd(formData);

},false);
addNavEvent();
// addDeleteEvent?
// addFilterEvent?

/* ARE WE LOGIN? */
logInOut();



/* refresh addmode 
 bouton grisé 
 redirection login>index si déjà log 
 peaufiner le css (surtout les boutons) */

/* 

1 : Récupérer les works depuis l'api 
a : Ajouter un then pour vérifier l'état de la réponse
b: Si positif on récupérer les works, on affiche les works
c : on catch l'erreur

2 : Créer une fonction pour générer les works récupérer via l'api
a : section, figure, img , title

3 : Créer la barre noir, je suis connecté je l'affiche, je suis pas connecté j'affiche rien 
a : Le code de la barre en noir est présente dans le HTML (display none)

4 : Créer la modal pour ajouter un nouveau work
a : J'ajout un work je ne recharge pas la page  
b : 





*/

/*
async function getWorks(){
    await fetch(url)
    .then((response) => {
        // On vérifie si le statut est en code 200
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (works) {
        genererwork(works);
        document.querySelectorAll(".btn").forEach((button) => {
            button.addEventListener("click", function () {
                const category = this.dataset.category;
                if (category == 0) {
                    document.querySelector(".gallery").innerHTML = "";
                    return genererwork(works);
                }
                const filterWorks = works.filter(
                    (work) => work.categoryId == category
                    );
                    document.querySelector(".gallery").innerHTML = "";
                    genererwork(filterWorks);
                });
            });
        })
        .catch(function (error) {
        console.error(error);
    });

}

function genererwork(works) {
    for (let i = 0; i < works.length; i++) {
        const sectionwork = document.querySelector(".gallery");
        const workelement = document.createElement("figure");
      const imageelement = document.createElement("img");
      imageelement.src = works[i].imageUrl;
      const nomelement = document.createElement("figcaption");
      nomelement.innerText = works[i].title;
      
      sectionwork.appendChild(workelement);
      workelement.appendChild(imageelement);
      workelement.appendChild(nomelement);
    }
}

*/

