function loadHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            setupHeader();
        });
}

function setupHeader() {
    fetch('http://localhost:3000/api/session', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            const navList = document.getElementById('navList');
            const loginListItem = document.querySelector('header nav ul li:last-child');
            fetch('http://localhost:3000/api/session', { credentials: 'include' })
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
                    loginLink.textContent = "Log In";
                    loginLink.href = "login.html"; // Ensure this points to your login page
                }
            })
            .catch(error => console.error('Error fetching session data:', error));
            
            if (data.isLoggedIn) {
                
                if (data.isAdmin) {
                    const addArticleLi = document.createElement('li');
                    addArticleLi.innerHTML = '<a style="color: red" href="/add_article.html">Add Article</a>';
                    navList.insertBefore(addArticleLi, loginListItem);

                    const updateArticleLi = document.createElement('li');
                    updateArticleLi.innerHTML = '<a style="color: red" href="/update_article.html">Update Article</a>';
                    navList.insertBefore(updateArticleLi, loginListItem);

                    const updateFeaturedLi = document.createElement('li');
                    updateFeaturedLi.innerHTML = '<a style="color: red" href="/update_featured.html">Update Featured</a>';
                    navList.insertBefore(updateFeaturedLi, loginListItem);

                    const psqlLi = document.createElement('li');
                    psqlLi.innerHTML = '<a style="color: red" href="/psql.html">PSQL</a>';
                    navList.insertBefore(psqlLi, loginListItem);

                    const pendingArticlesLi = document.createElement('li');
                    pendingArticlesLi.innerHTML = '<a style="color: red" href="/pending_articles.html">Pending Articles</a>';
                    navList.insertBefore(pendingArticlesLi, loginListItem);
                }
                
            } else {
                loginListItem.innerHTML = '<a href="login.html">Log In</a>';
            }
        })
        .catch(error => console.error('Error fetching session data:', error));
}

document.addEventListener('DOMContentLoaded', loadHeader);
