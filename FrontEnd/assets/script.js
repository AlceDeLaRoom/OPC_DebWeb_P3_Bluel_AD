

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
    categoriesDiv.appendChild(addBtn("Tous", " selected"));
    for (const category of categories){
        categoriesDiv.appendChild(addBtn(category.name));
    };
    return categoriesDiv;
};

function addBtn(categorie, selectedBtn = ""){
    const btnCat = document.createElement("a");
    btnCat.className = "btn" + selectedBtn;
    const txtBtn = document.createElement("p");
    txtBtn.innerHTML = categorie;
    btnCat.appendChild(txtBtn);
    btnCat.addEventListener("click", function(){/selected/.test(btnCat.className)? console.log("Already selected!"):clicCat(btnCat)});
    return btnCat;
};

function clicCat(btn){
    gallery.innerHTML = '';
    showWorks(btn.firstChild.innerHTML);
    const oldBtn = gallery.parentNode.querySelector(".selected");
    oldBtn.className = "btn";
    btn.className += " selected";
};

/* show work "Tous" for all */
function showWorks(category){
    if (/Tous/.test(category)) {
        console.log("on affiche tout!")
        for (const cat of categories){
            showWorks(cat.name);
        }
    }
    else{
        category = category.replace(/&amp;/g,"&");
        console.log("on affiche ", category)
        for (const work of works){
            if (RegExp(category).test(work.category.name)){
                
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


