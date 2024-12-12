const loginApi = "http://localhost:5678/api/users/login"; 

document.getElementById("loginform").addEventListener("submit", handleSubmit); 

async function handleSubmit(event) {
    event.preventDefault(); 
    
    const existingErrorBox = document.querySelector(".error-login");
    if (existingErrorBox) {
        existingErrorBox.remove();
    }

    let user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    };

    let response = await fetch(loginApi, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user),
    });

    if (response.status != 200) { 
        const errorBox = document.createElement('div');
        errorBox.className = "error-login";
        errorBox.innerHTML = "E-mail et/ou mot de passe incorrect";
        document.querySelector("form").append(errorBox);
    } else { 
        let result = await response.json();
        const token = result.token;
        sessionStorage.setItem("authToken", token); 
        window.location.href = "index.html"; 
    }
}
