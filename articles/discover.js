window.onload = function() {
    fetchArticles();
};

function fetchArticles() {
    fetch(`${apiUrl}/get-data`, { credentials: 'include' }) // Adjust endpoint as needed
        .then(response => response.json())
        .then(articles => {
            const articlesGrid = document.getElementById('articlesGrid');
            articlesGrid.innerHTML = ''; // Clear existing articles
            articles.forEach(article => {
                const articleCard = document.createElement('div');
                articleCard.className = 'article-card';

                articleCard.style = "margin-top:10px; border: 1px solid #eeeeee;"

                const title = document.createElement('div');
                title.className = 'article-title';
                title.textContent = article.title;

                const summary = document.createElement('div');
                summary.className = 'article-summary';
                summary.textContent = article.summary; // Adjust as per your data structure

                const readMoreBtn = document.createElement('a');
                readMoreBtn.href = `/articles/article.html?id=${article.id}`; // Adjust as needed
                readMoreBtn.className = 'blue-button';
                readMoreBtn.textContent = 'Read More';

                articleCard.appendChild(title);
                articleCard.appendChild(summary);
                articleCard.appendChild(readMoreBtn);

                articlesGrid.appendChild(articleCard);
            });
        })
        .catch(error => console.error('Failed to fetch articles:', error));
}

function searchArticles() {
    const searchTerm = document.getElementById('searchInput').value;
    if (!searchTerm.trim()) {
        alert('Please enter a search term.');
        return;
    }

    // Call the search endpoint with the search term
    fetch(`${apiUrl}/search-articles?q=${encodeURIComponent(searchTerm)}`, { credentials: 'include' })
        .then(response => response.json())
        .then(articles => {
            const articlesGrid = document.getElementById('articlesGrid');
            articlesGrid.innerHTML = ''; // Clear existing articles
            articles.forEach(article => {
                const articleCard = document.createElement('div');
                articleCard.className = 'article-card enhanced';
            
                const title = document.createElement('h3');
                title.className = 'article-title enhanced';
                title.textContent = article.title;
            
                const summary = document.createElement('p');
                summary.className = 'article-summary enhanced';
                summary.textContent = article.summary;
            
                const readMoreBtn = document.createElement('a');
                
                readMoreBtn.href = `/articles/article.html?id=${article.id}`;
                readMoreBtn.className = 'blue-button';
                readMoreBtn.textContent = 'Read More';
            
                articleCard.appendChild(title);
                articleCard.appendChild(summary);
                articleCard.appendChild(readMoreBtn);
            
                articlesGrid.appendChild(articleCard);
            });
            
        })
        .catch(error => console.error('Failed to search articles:', error));
}

