

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
        categoriesDiv.appendChild(addBtn(categorie["name"]));
    };
    return categoriesDiv;
};

function addBtn(categorie, mainBtn = ""){
    const btnCat = document.createElement("a");
    btnCat.className = "btn" + mainBtn;
    btnCat.href = "#";
    const txtBtn = document.createElement("p");
    txtBtn.innerHTML = categorie;
    btnCat.appendChild(txtBtn); 
    return btnCat;
};




/* show one kind of stuff */

/* show all */

const gallery = document.querySelector(".gallery");

let categories = await apiControler("categories");
gallery.appendChild(addButtonCategories(categories));
console.log(gallery);

let works = await apiControler("works");


