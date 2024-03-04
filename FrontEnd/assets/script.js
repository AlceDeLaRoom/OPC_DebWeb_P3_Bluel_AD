const TOKEN = JSON.parse(localStorage.getItem("token")).token;
const AUTH = await apiAuth()
if (AUTH) {
    console.log("editionMode()")
};

/* verify the token */
async function apiAuth() {
    let auth = false;
    await fetch("http://localhost:5678/api/users/auth", {
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

/* get/post/delete api */
async function apiGet() {
    const response = await fetch("http://localhost:5678/api/works", {});
    let data = await response.json();
    // console.log ("données récupérées: ", data)
    return data;
};

async function apiGetCategory(){
    const response = await fetch("http://localhost:5678/api/categories", {});
    let data = await response.json();
    // console.log ("données récupérées: ", data)
    return data;
}

async function apiDelete(id){
    console.log("delete");
    await fetch('http://localhost:5678/api/works/'+id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + TOKEN
        }
    }).catch((error)=>{console.error(error)})
}

/* add categories's buttons */
function addButtonCategories(categories){
    const categoriesDiv = document.createElement("div");
	categoriesDiv.className = "categories";
    categoriesDiv.appendChild(addBtn("Tous", " selected"));
    for (const category of categories){
        categoriesDiv.appendChild(addBtn(category.name));
    };
    return categoriesDiv;
};

function addBtn(categorie, selectedBtn = ""){
    const btnCat = document.createElement("div");
    btnCat.className = "btn" + selectedBtn;
    const txtBtn = document.createElement("p");
    txtBtn.innerHTML = categorie;
    btnCat.appendChild(txtBtn);
    btnCat.addEventListener("click", ()=>{/selected/.test(btnCat.className)? console.log("Already selected!"):clicCat(btnCat)});
    return btnCat;
};

function clicCat(btn){
    gallery.innerHTML = '';
    showWorks(btn.firstChild.innerHTML);
    const oldBtn = gallery.parentNode.querySelector(".selected");
    oldBtn.className = "btn";
    btn.className += " selected";
};

/* show work, category = "Tous" for all, don't forget to clean up gallery */
function showWorks(category = "Tous" , contenor = gallery){
    if (/Tous/.test(category)) {
        /*console.log("on affiche tout!")*/
        for (const cat of categories){
            showWorks(cat.name, contenor);
        }
    }
    else{
        category = category.replace(/&amp;/g,"&");
        /*console.log("on affiche ", category, "dans ", contenor)*/
        const title = RegExp("delete").test(contenor.className)? false : true;
        for (const work of works){
            if (RegExp(category).test(work.category.name)){
                contenor.appendChild(showOnework(work, title));
            };
        };
    };
}

function showOnework(work, title = true){
    /*console.log("Add work: ", work.title)*/
    const newWork = document.createElement("div");
    newWork.className = "work";
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    newWork.appendChild(img);

    if (title){
        const imgTitle = document.createElement("p");
        imgTitle.innerHTML = work.title;
        newWork.appendChild(imgTitle);
    }
    else{
        const btnIcon = document.createElement("div");
        btnIcon.className = "btnTrashCan";
        newWork.appendChild(btnIcon);
        const icon = document.createElement("i");
        icon.className = "fa-solid fa-trash-can";
        btnIcon.appendChild(icon);
        btnIcon.addEventListener("click", ()=>{deleteWork(work.id)});
    };

    return newWork;
}

async function deleteWork(id){
    await apiDelete(id)
    .then(refreshWorks())
    .catch((error)=>{console.log(error)});
}

function refreshWorks(){
    gallery.innerHTML = '';
    deleteGallery.innerHTML = '';
    loadWorks();
    console.log("on viens de refresh!")
};

function loadWorks(){
    showWorks();
    showWorks("Tous", deleteGallery);
}


const gallery = document.querySelector(".gallery");
const deleteGallery = document.querySelector(".delete-gallery");

let categories = await apiGetCategory();
gallery.parentNode.insertBefore(addButtonCategories(categories), gallery.previousSibling);

let works = await apiGet();

loadWorks();

// Supprimer le token du localStorage localStorage.removeItem("token");