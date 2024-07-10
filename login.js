document.getElementById('createAccountForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('createEmail').value;
    const password = document.getElementById('createPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    console.log('Creating account...');
    const response = await fetch('http://localhost:3000/create-account', {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
    });

    if (response.ok) {
        alert('Account created successfully!');
    } else {
        alert('Failed to create account. The email may already be in use.');
    }
});

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            //alert('Login successful!');
            // After login success in login.html
            window.location.href = 'website.html?login=success';

            ////////////////////////////
            const loginLink = document.querySelector('header nav ul li:last-child a');
            console.log("login.js",data.isLoggedIn, data.email, data.isAdmin)
            
            if (data.isLoggedIn) {
                loginLink.textContent = data.email; // Change "Log In" to the user's email
                loginLink.href = "#"; // Update href if needed, e.g., to a profile page or logout function
                
                if (data.isAdmin) {
                    loginLink.style.color = 'red'; // Make the email red for admins
                }
            } else {
                loginLink.textContent = "Log In";
                loginLink.href = "login.html"; // Ensure this points to your login page
            }
            ////////////////
            updateLoginUI(data.isLoggedIn, data.email, data.isAdmin);
        } else {
            alert(data.message || 'Login failed.');
        }
    } catch (error) {
        console.error('Failed to submit login form:', error);
        alert('Failed to login.');
    }
});

function updateLoginUI(isLoggedIn, email, isAdmin) {
    const loginLink = document.querySelector('header nav ul li:last-child a');
    if (isLoggedIn) {
        loginLink.textContent = email;
        loginLink.href = "#";
        if (isAdmin) {
            loginLink.style.color = 'red';
        }
    } else {
        loginLink.textContent = "Log In";
        loginLink.href = "login.html";
    }
}

// Then call this function both after login and when checking session status
