
const api = "http://localhost:8160" // upadte this as per your url

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        const response = await fetch(`${api}/user/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Signup successful! Please log in.");
            window.location.href = '../login.html';
        } else {
            alert(data.message || "Signup failed");
        }
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
});
