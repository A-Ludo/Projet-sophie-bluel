let works = []
let categories = []
//centraliser URL

async function getWorks() {
    const url = 'http://localhost:5678/api/works';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        works = await response.json();
        displayFigures(works)        
    } catch (error) {
        console.error(error.message);
    }
}

function filterWorks (filter) {
    const filtered = works.filter((data) => data.categoryId === filter);
    displayFigures (filtered)
}


function displayFigure(data) {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
                        <figcaption>${data.title}</figcaption>`;
    document.querySelector(".gallery").append(figure);
}

function displayFigureModal(data) {
    const div = document.createElement ("div")
    const figure = document.createElement("figure");
    const buttonDelete = document.createElement("button")
    buttonDelete.innerHTML = "<i class=\"fas fa-trash-can fa-lg\"></i>"
    buttonDelete.addEventListener ("click", () => deleteWork(data))
    figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>`;
    div.append(figure);
    div.append(buttonDelete)
    document.querySelector(".modal-container .container").append(div);
}

async function deleteWork(work) {
    const url = `http://localhost:5678/api/works/${work.id}`; 
    const token = sessionStorage.getItem("authToken");
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            console.log("Travail supprimé avec succès :", work.id);
            await getWorks();
            displayFiguresModal(works)
        } else {
            console.error("Échec de la suppression :", response.status);
            alert("Erreur lors de la suppression du travail.");
        }
    } catch (error) {
        console.error("Erreur lors de la requête DELETE :", error);
        alert("Une erreur est survenue lors de la suppression.");
    }
}

function displayFigures(works){
    document.querySelector(".gallery").innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        displayFigure(works[i]);
    }
}

function displayFiguresModal(works){
    document.querySelector(".container").innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        displayFigureModal(works[i]);
    }
}

async function getFilter() {
    const url = 'http://localhost:5678/api/categories';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        categories = await response.json();
        displayFilters(categories)
    } catch (error) {
        console.error(error.message);
    }
}

function displayFilters(filters) {
    const filter = document.createElement("input");
    filter.type = "button";
    filter.value = "Tous";
    filter.classList.add("active")
    document.querySelector(".filter-bar").append(filter);
    filter.addEventListener("click", () => { 
        document.querySelectorAll(".filter-bar input").forEach(btn => btn.classList.remove("active"));
        filter.classList.add("active");
        displayFigures(works)});

    for (let i = 0; i < filters.length; i++) {
        setFilter(filters[i]);
    }
}

function setFilter(data) {
    const filter = document.createElement("input");
    filter.type = "button";
    filter.value = data.name;
    filter.id = data.id;
    document.querySelector(".filter-bar").append(filter);
    filter.addEventListener("click", () => {
        document.querySelectorAll(".filter-bar input").forEach(btn => btn.classList.remove("active"));
        filter.classList.add("active");
        filterWorks(data.id);
})};

async function filteredWorks() {
    try {
        const data = await fetchData(); 
        processData(data); 
    } catch (error) {

    }
}

function displayAdminMode() {
    if (sessionStorage.authToken) {
        //ajout du bandeau d'admin
        const editBanner = document.createElement("div");
        editBanner.className = "edit-mode";
        editBanner.innerHTML = '<p class=modal-trigger><i class="fa-regular fa-pen-to-square"></i>    Mode édition</p>';
        document.querySelector("body").prepend(editBanner);
        //changement du login en logout
        const loginLink = document.querySelector('li a[href="login.html"]');
        loginLink.textContent = "logout";
        //ajout modifier au titre
        const projectsTitle = document.querySelector("#portfolio h2.projet");
        projectsTitle.innerHTML += '<span class=modal-trigger><i class="fa-regular fa-pen-to-square"></i>    modifier</span>';
    }
}

getWorks();
getFilter();
displayAdminMode();

// partie création modale V2// Modale 1

function createModalPictureEdit() {
    
    const modal = document.querySelector('.modal-body');

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-modal', 'modal-trigger');
    closeButton.addEventListener("click", () => {
        resetModalContainer();
        toggleModal();
    });
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-xmark', 'fa-lg');
    closeButton.appendChild(closeIcon);
    modal.appendChild(closeButton);

    const title = document.createElement('h1');
    title.textContent = 'Galerie photo';
    modal.appendChild(title);

    const container = document.createElement('div');
    container.classList.add('container');
    modal.appendChild(container);

    const addButton = document.createElement('button');
    addButton.classList.add('button-add-picture');
    addButton.textContent = 'Ajouter une photo';
    addButton.addEventListener("click", () => {
        resetModalContainer();
        createModalAddPicture();
        displayFilterOption();
    });
    modal.appendChild(addButton);

    const overlay = document.querySelector('.overlay.modal-trigger');
    overlay.insertAdjacentElement('afterend', modal);
}

// partie création modale V2// Modale 2

function createModalAddPicture() {

    const modal = document.querySelector('.modal-body');
    
    const returnButton = document.createElement('button');
    returnButton.classList.add('return-modal');
    returnButton.addEventListener("click", () => {
        resetModalContainer();
        createModalPictureEdit();
        displayFiguresModal(works);
    })
    const returnIcon = document.createElement('i');
    returnIcon.classList.add('fas', 'fa-arrow-left');
    returnButton.appendChild(returnIcon);
    modal.appendChild(returnButton);

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-modal', 'modal-trigger');
    closeButton.addEventListener("click", () => {
        resetModalContainer();
        toggleModal();
    });
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-xmark', 'fa-lg');
    closeButton.appendChild(closeIcon);
    modal.appendChild(closeButton);

    const title = document.createElement('h1');
    title.textContent = 'Ajout Photo';
    modal.appendChild(title);

    const container = document.createElement('div');
    container.classList.add('form-container');

    const form = document.createElement('form');
    form.id = 'add-work';
    form.action = '#';
    form.method = 'post';

    const fileUpload = document.createElement('div');
    fileUpload.classList.add('file-upload');
    fileUpload.id = 'file-upload-container';

    // Vérifier si l'image est présente au changement
    const observer = new MutationObserver(validateForm);
    observer.observe(fileUpload, { childList: true });


    const fileIcon = document.createElement('i');
    fileIcon.classList.add('fa-regular', 'fa-image');
    fileUpload.appendChild(fileIcon);

    const fileText = document.createElement('p');
    fileText.textContent = '+ Ajouter photo';
    fileUpload.appendChild(fileText);

    const fileSmall = document.createElement('small');
    fileSmall.textContent = 'jpg, png : 4mo max';
    fileUpload.appendChild(fileSmall);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'fileInput';
    fileInput.accept = '.jpg, .jpeg, .png';
    fileInput.addEventListener('change', handleFileChange);
    form.appendChild(fileInput);
    fileUpload.addEventListener('click' , () => fileInput.click());
    form.appendChild(fileUpload);

    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'title-add-picture');
    titleLabel.textContent = 'Titre';
    form.appendChild(titleLabel);

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.name = 'title-add-picture';
    titleInput.id = 'title-add-picture';
    titleInput.addEventListener('input', validateForm);
    form.appendChild(titleInput);

    const submitButton = document.createElement('button');
    submitButton.classList.add('add-picture-submit');
    submitButton.type = 'button';
    submitButton.id = 'submitBtn';
    submitButton.textContent = 'Valider';
    submitButton.addEventListener("click", submitForm)
    form.appendChild(submitButton);

    container.appendChild(form);
    modal.appendChild(container);

    const overlay = document.querySelector('.overlay.modal-trigger');
    overlay.insertAdjacentElement('afterend', modal);
}

// partie création modale V2// Reset modale

function resetModalContainer() {
    const modalContainer = document.querySelector('.modal-body');
    modalContainer.innerHTML = '';
}

//Switch modale//

const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");

document.body.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal-trigger")) {
        toggleModal();
    }
});

async function toggleModal(){
    modalContainer.classList.toggle("active")
    if (modalContainer.classList.contains("active")) {
        resetModalContainer();
        createModalPictureEdit();
        displayFiguresModal(works);
    }
}

async function toggleModalAddPicture(){
    modalAddPicture.classList.toggle("active")
    if (!modalAddPicture.classList.contains("active")) {
    }
}

// Fonction select option

function displayFilterOption() {

    const label = document.createElement("label");
    label.setAttribute("for", "categorie-choice");
    label.textContent = "Catégorie";

    const select = document.createElement("select");
    select.id = "categorie-choice";
    select.addEventListener("change", (event) => {
        const selectedOption = event.target.selectedOptions[0];
        const name = selectedOption.value; 
        const id = selectedOption.dataset.id;
        validateForm();
    });
    
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    select.append(defaultOption);

    for (let i = 0; i < categories.length; i++) {
        addFilterOption(select, categories[i]);
    }

    const referenceInput = document.querySelector("#title-add-picture");
    referenceInput.insertAdjacentElement("afterend", label);
    label.insertAdjacentElement("afterend", select);
}

function addFilterOption(selectElement, data) {   
    const option = document.createElement("option");
    option.value = data.name;
    option.textContent = data.name;
    option.setAttribute("data-id", data.id); 
    selectElement.append(option);
}

//Affichage de la photo 

function handleFileChange(event) {
    const file = event.target.files[0]; 
    const uploadContainer = document.getElementById('file-upload-container');
    if (file) {
        const maxSizeInBytes = 4 * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            alert("Le fichier est trop volumineux. Maximum autorisé : 4 Mo");
            event.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            uploadContainer.innerHTML = "";
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.style.maxWidth = '100%';
            imgElement.style.maxHeight = '170px';
            imgElement.style.objectFit = 'contain';
            imgElement.style.display = 'block';
            uploadContainer.appendChild(imgElement);
        };
        reader.readAsDataURL(file);
    }
}

// verification formulaire valide

    // Fonction pour vérifier si toutes les conditions sont remplies
    function validateForm() {
        const uploadContainer = document.getElementById('file-upload-container');
        const titleInput = document.getElementById('title-add-picture');
        const categorySelect = document.getElementById('categorie-choice');
        const submitBtn = document.getElementById('submitBtn');
        const imagePresent = uploadContainer.querySelector('img') !== null;
        const titlePresent = titleInput.value.trim() !== '';
        const categoryChosen = categorySelect.value !== '';
    
        if (imagePresent && titlePresent && categoryChosen) {
            submitBtn.classList.add("active");     
        } else {
            submitBtn.classList.remove("active");     
        }
    }

    async function submitForm () {
        const titleInput = document.getElementById("title-add-picture");
        const categorySelect = document.getElementById("categorie-choice");
        const fileInput = document.getElementById("fileInput");

        const existingErrorBox = document.querySelector(".error-login");
        if (existingErrorBox) {
            existingErrorBox.remove();
        }

        if (!fileInput.value || !titleInput.value || !categorySelect.value) {
          const errorBox = document.createElement('div');
          errorBox.className = "error-login";
          errorBox.innerHTML = "Veuillez remplir tous les champs et ajouter une image.";
          document.getElementById("add-work").append(errorBox);
          return;
        }
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          alert("Vous devez être connecté pour ajouter un travail.");
          return;
        }
    
         // Récupération des données
        const selectedOption = categorySelect.options[categorySelect.selectedIndex];
        const categoryId = selectedOption.getAttribute("data-id");

        const formData = new FormData();
        formData.append('title', titleInput.value);
        formData.append('category', categoryId);
        formData.append('image', fileInput.files[0]);
      
        try {
          const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`
            },
            body: formData,
          });
      
          if (response.ok) {
            const result = await response.json();
            modalContainer.classList.remove("active")
            resetModalContainer()
            getWorks()
          } else {
            alert("Erreur lors de l'ajout du travail.");
          }
        } catch (error) {
          alert("Une erreur est survenue lors de l'ajout du travail.");
        }
    }