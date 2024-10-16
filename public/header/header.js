function loadHeader() {
    fetch('/header/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            setupHeader();
        });
}

function setupHeader() {
    fetch(`${apiUrl}/session`, { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            const navList = document.getElementById('navList');
            const loginListItem = document.querySelector('header nav ul li:last-child');
            fetch(`${apiUrl}session`, { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                const loginLink = document.querySelector('header nav ul li:last-child a');
                console.log("HERE")
                console.log("Logged IN: ", data.isLoggedIn)
                if (data.isLoggedIn && loginLink) {
                    loginLink.textContent = data.email; // Change "Log In" to the user's email
                    loginLink.href = "#"; // Update href if needed, e.g., to a profile page or logout function
                    
                    if (data.isAdmin) {
                        loginLink.style.color = 'red'; // Make the email red for admins
                    }
                } else {
                    if (loginLink){
                        loginLink.textContent = "Log In";
                        loginLink.href = "/login"; // Ensure this points to your login page
                    }
                }
            })
            .catch(error => console.error('Error fetching session data:', error));
            
            if (data.isLoggedIn) {
                
                if (data.isAdmin) {
                    const addArticleLi = document.createElement('li');
                    addArticleLi.innerHTML = '<a style="color: red" href="/articles/add">Add Article</a>';
                    navList.insertBefore(addArticleLi, loginListItem);

                    // const updateArticleLi = document.createElement('li');
                    // updateArticleLi.innerHTML = '<a style="color: red" href="/update_article.html">Update Article</a>';
                    // navList.insertBefore(updateArticleLi, loginListItem);

                    const updateFeaturedLi = document.createElement('li');
                    updateFeaturedLi.innerHTML = '<a style="color: red" href="/featured/update">Update Featured</a>';
                    navList.insertBefore(updateFeaturedLi, loginListItem);

                    const psqlLi = document.createElement('li');
                    psqlLi.innerHTML = '<a style="color: red" href="/psql">PSQL</a>';
                    navList.insertBefore(psqlLi, loginListItem);

                    const pendingArticlesLi = document.createElement('li');
                    pendingArticlesLi.innerHTML = '<a style="color: red" href="/articles/pending">Pending Articles</a>';
                    navList.insertBefore(pendingArticlesLi, loginListItem);
                }
                
            } else {
                loginListItem.innerHTML = '<a href="/login">Log In</a>';
            }
           
            const userMenu = document.querySelector('header nav ul li:last-child');
            userMenu.innerHTML = '';
            if (data.isLoggedIn) {
                const emailButton = document.createElement('button');
                emailButton.textContent = data.email;
                emailButton.className = 'email-button'; // Apply button styling
                emailButton.onclick = () => { window.location.href = '/profile'; }; // Redirect on click

                if (data.isAdmin) {
                    emailButton.style.color = 'red';
                }

                userMenu.appendChild(emailButton);
            } else {
                const loginLink = document.createElement('a');
                loginLink.textContent = "Log In";
                loginLink.href = "/login";
                userMenu.appendChild(loginLink);
            }


            

        })
        .catch(error => console.error('Error fetching session data:', error));
}








document.addEventListener('DOMContentLoaded', loadHeader);
