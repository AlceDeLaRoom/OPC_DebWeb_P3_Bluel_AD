const form = document.getElementById('form');

form.addEventListener('submit', async function (e)  {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const body = { email: email, password: password };
    const bodyJson = JSON.stringify(body);

    // CRUD = CREATE (POST), READ (GET), UPDATE (PUT), DELETE (DELETE)
    await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: bodyJson
    })
    .then((response) => response.json())
    .then((data) => {
        if(data.token){
            const responseData = JSON.stringify(data);
            localStorage.setItem('token', responseData);
            window.location.href = 'index.html';
        }else{
            alert('Identifiant ou mot de passe incorrect');
        }
    })
    .catch((error) => {
        console.error(error);
    });
});