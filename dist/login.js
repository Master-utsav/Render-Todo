
const api = "http://localhost:8160" // upadte this as per your url

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${api}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = '../index.html';
        } else {
            alert(data.message || "Login failed");
        }
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
});
