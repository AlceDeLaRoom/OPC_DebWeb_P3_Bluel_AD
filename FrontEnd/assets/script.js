

/* get/post/delete api */
async function apiControler(urlEnd = "") {
    console.log(urlEnd)
    const response = await fetch("http://localhost:5678/api/" + urlEnd, {});
    let data = await response.json();
    console.log ("données récupérées: ", data)
    return data;
};

/* add categories's buttons */
function addButtonCategories(categories){
    const categoriesDiv = document.createElement("div");
	categoriesDiv.className = "categories";
    categoriesDiv.appendChild(addBtn("Tous", " main"));
    for (const categorie of categories){
        categoriesDiv.appendChild(addBtn(categorie.name));
    };
    return categoriesDiv;
};

function addBtn(categorie, mainBtn = ""){
    const btnCat = document.createElement("a");
    btnCat.className = "btn" + mainBtn;
    const txtBtn = document.createElement("p");
    txtBtn.innerHTML = categorie;
    btnCat.appendChild(txtBtn);
    btnCat.addEventListener("click", function(){/main/.test(btnCat.className)? console.log("Already load!"):clicCat(btnCat)});
    return btnCat;
};

function clicCat(btn){
    gallery.innerHTML = '';
    showWorks(btn.firstChild.innerHTML);
    const oldBtn = document.querySelector(".main");
    oldBtn.className = "btn";
    btn.className += " main";
};

/* show work "Tous" for all */
function showWorks(categorie){
    if (/Tous/.test(categorie)) {
        console.log("on affiche tout!")
        for (const cat of categories){
            showWorks(cat.name);
        }
    }
    else{
        categorie = categorie.replace(/&amp;/g,"&");
        console.log("on affiche ", categorie)
        for (const work of works){
            if (RegExp(categorie).test(work.category.name)){
                
                gallery.appendChild(showOnework(work));
            };
        };
    };
}

function showOnework(work){
    console.log("Add work: ", work.title)
    const newWork = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.innerHTML = work.title;

    newWork.appendChild(img);
    newWork.appendChild(figcaption);
    return newWork;
}

/* show all */
const gallery = document.querySelector(".gallery");

let categories = await apiControler("categories");
gallery.parentNode.insertBefore(addButtonCategories(categories), gallery.previousSibling);

let works = await apiControler("works");

showWorks("Tous")


