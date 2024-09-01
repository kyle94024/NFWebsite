document.addEventListener("DOMContentLoaded", () => {
    fetchArticles();
});

async function fetchArticles() {
    // Fetch featured and all articles. This example assumes you have endpoints set up for these.
    const [featuredResp, allResp] = await Promise.all([
        fetch('http://localhost:3000/get-featured-articles', {credentials: 'include'}),
        fetch('http://localhost:3000/get-data', {credentials: 'include'})
    ]);
    const featuredArticles = await featuredResp.json();
    const allArticles = await allResp.json();

    const featuredIds = new Set(featuredArticles.map(article => article.id));
    const featuredContainer = document.getElementById('featured');
    const otherArticlesContainer = document.getElementById('other_articles');

    // Clear previous content
    featuredContainer.innerHTML = '';
    otherArticlesContainer.innerHTML = '';

    featuredContainer.classList.add('container');
    otherArticlesContainer.classList.add('container');

    // Display articles
    allArticles.forEach(article => {
        const articleElement = createArticleElement(article, featuredIds.has(article.id));
        if (featuredIds.has(article.id)) {
            featuredContainer.appendChild(articleElement);
        } else {
            otherArticlesContainer.appendChild(articleElement);
        }
    });
}

function createArticleElement(article, isFeatured) {
    const articleElement = document.createElement('article');
    articleElement.className = 'article'; // Optional: for styling

    // Create and populate the title element
    const title = document.createElement('h3');
    title.textContent = article.title;
    articleElement.appendChild(title);

    // Create and populate a snippet of the content or innertext
    const content = document.createElement('p');
                    
    // Create a temporary DOM element to parse the HTML content
    const tempDivElement = document.createElement('div');
    // Set its HTML content to your article's inner HTML
    // tempDivElement.innerHTML = article.innertext || ''; //old version
    tempDivElement.innerHTML = article.summary || '';
    // Extract text content, effectively stripping HTML tags
    const plainTextContent = tempDivElement.textContent || tempDivElement.innerText || '';
    
    // Cut the plain text content after 100 characters and add ellipsis if necessary
    const snippet = plainTextContent.length > 300 ? plainTextContent.substring(0, 300) + '...' : plainTextContent;
    content.textContent = snippet;
    
    articleElement.appendChild(content);

    // const contentSnippet = document.createElement('p');
    // contentSnippet.textContent = article.innertext ? article.innertext.substring(0, 100) + '...' : '';
    // articleElement.appendChild(contentSnippet);

    //Toggle Button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = isFeatured ? 'Unfeature' : 'Feature';
    toggleButton.classList.add('button'); // Add the general button class
    toggleButton.classList.add(isFeatured ? 'featured' : 'not-featured'); // Add specific class based on status
    toggleButton.onclick = () => {
        toggleFeatured(article.id, !isFeatured);
        // Optionally, re-fetch articles to refresh the view
    };
    articleElement.appendChild(toggleButton);

    return articleElement;
}

// app.get('/get-article/:id', async (req, res) => {
//     const articleId = req.params.id;

//     try {
//         // Assuming your articles are stored in a table named 'articles'
//         const queryResult = await pool.query('SELECT * FROM articles WHERE id = $1', [articleId]);

//         if (queryResult.rows.length > 0) {
//             res.json(queryResult.rows[0]); // Send the article as a JSON response
//         } else {
//             res.status(404).send('Article not found');
//         }
//     } catch (error) {
//         console.error('Error fetching article by ID:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });


async function toggleFeatured(articleId, shouldBeFeatured) {
    await fetch(`http://localhost:3000/update-featured-status`, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, shouldBeFeatured })
    });
    fetchArticles(); // Refresh the articles display
}


