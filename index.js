require('dotenv').config(); // This line loads the environment variables from the .env file
const axios = require('axios');
const express = require('express');
const cors = require('cors'); // Import cors
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
// const pg = require('pg');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Uploaded files will be stored in the 'uploads/' directory


const app = express();
const punycode = require('punycode/');
app.use(express.static('public')); // 'public' is the directory where index.html is located


const session = require('express-session');
// const pgSession = require('connect-pg-simple')(session);

app.use(session({
    // store: new pgSession({
    //     pool: pool, // Connection pool you created earlier
    //     tableName: 'session' // Use another table name if you prefer
    // }),
    secret: 'secret-key', // Change this to a random value
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, // 30 days
        secure: false}
}));

app.set('trust proxy', 1); // Trust first proxy



// const { OpenAIApi, Configuration } = require("openai");

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// Middleware to check if the user is an admin
const requireAdmin = (req, res, next) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).send('Access denied. Admins only.');
    }
    next();
};


const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    // organization is optional, add if necessary
});

const port = 3000;

const corsOptions = {
    origin: function (origin, callback) {
        // List of allowed origins
        const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];
        
        // Check if the request's origin is in the list of allowed origins
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true); // Allow the origin
        } else {
            callback(new Error('CORS policy does not allow this origin'));
        }
    },
    credentials: true, // Important for cookies, authorization headers with HTTPS
};
app.use(cors(corsOptions));

app.use(express.json()); 

// Use environment variables for the Pool configuration
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: {
        rejectUnauthorized: false, // You might need this to avoid self-signed certificates
        require: true, // This will ensure that SSL is used
    }
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/get-data', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM article;');
      res.json(result.rows);
    } catch (err) {
      console.error('Error executing query', err.stack);
      res.status(500).json({error: 'Error executing query'}); // Ensure JSON response
    }
  });

//   app.post('/add-article', async (req, res) => {
//     const { title, tags, innertext , article_link} = req.body;
//     console.log("JGEWKJWGE",article_link)
//     try {
//         // Summarize the innertext before saving
//         const summary = await summarizeArticle(innertext);

//         const result = await pool.query(
//             'INSERT INTO article (title, tags, innertext, summary, search_vector, article_link) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
//             [title, tags, innertext, summary, "", article_link] // Add 'summary' to the values being inserted
//         );

//         res.json(result.rows[0]);
//     } catch (err) {
//         console.error('Error adding article:', err.stack);
//         res.status(500).json({ error: 'Error adding article' });
//     }
// });

// Existing imports and setup...

app.post('/add-article', async (req, res) => {
    const { title, tags, innertext, article_link, simplifyLength} = req.body;
    try {
        // Summarize the innertext before saving
        const summary = await summarizeArticle(innertext);

        const simplified = await simplifyArticle(innertext, simplifyLength);
        console.log("SIMPLIFIED IN AA", simplified);

        const result = await pool.query(
            'INSERT INTO pending_article (title, tags, innertext, summary, article_link) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
            [title, tags, simplified, summary, article_link]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding article:', err.stack);
        res.status(500).json({ error: 'Error adding article' });
    }
});

// New endpoints to handle pending articles
app.get('/get-pending-articles', requireAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pending_article ORDER BY created_at DESC;');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching pending articles', err.stack);
        res.status(500).send('Error fetching pending articles');
    }
});

app.post('/update-pending-article', requireAdmin, async (req, res) => {
    const { id, title, tags, innertext, summary, article_link } = req.body;
    try {
        await pool.query(
            'UPDATE pending_article SET title = $1, tags = $2, innertext = $3, summary = $4, article_link = $5 WHERE id = $6',
            [title, tags, innertext, summary, article_link, id]
        );
        res.json({ success: true, message: 'Pending article updated successfully!' });
    } catch (err) {
        console.error('Error updating pending article:', err.stack);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/publish-article', requireAdmin, async (req, res) => {
    const { id } = req.body;
    try {
        const result = await pool.query('SELECT * FROM pending_article WHERE id = $1', [id]);
        const article = result.rows[0];

        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        await pool.query(
            'INSERT INTO article (title, tags, innertext, summary, article_link) VALUES ($1, $2, $3, $4, $5)',
            [article.title, article.tags, article.innertext, article.summary, article.article_link]
        );

        await pool.query('DELETE FROM pending_article WHERE id = $1', [id]);
        res.json({ success: true, message: 'Article published successfully!' });
    } catch (err) {
        console.error('Error publishing article:', err.stack);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/delete-pending-article', requireAdmin, async (req, res) => {
    const { id } = req.body;
    try {
        await pool.query('DELETE FROM pending_article WHERE id = $1', [id]);
        res.json({ success: true, message: 'Pending article deleted successfully!' });
    } catch (err) {
        console.error('Error deleting pending article:', err.stack);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


app.post('/retract-article', requireAdmin, async (req, res) => {
    const { id } = req.body;
    try {
        const result = await pool.query('SELECT * FROM article WHERE id = $1', [id]);
        const article = result.rows[0];

        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        await pool.query(
            'INSERT INTO pending_article (title, tags, innertext, summary, article_link) VALUES ($1, $2, $3, $4, $5)',
            [article.title, article.tags, article.innertext, article.summary, article.article_link]
        );

        await pool.query('DELETE FROM article WHERE id = $1', [id]);
        res.json({ success: true, message: 'Article retracted successfully!' });
    } catch (err) {
        console.error('Error retracting article:', err.stack);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


///////////////////////////////



app.get('/get-recent-articles', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM article ORDER BY id DESC LIMIT 6' // Assuming 'id' is an auto-increment column
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching recent articles', err.stack);
        res.status(500).send('Error fetching recent articles');
    }
});

app.get('/get-featured-articles', async (req, res) => {
    try {
        const featuredResult = await pool.query(
            'SELECT article_ids FROM featured LIMIT 1'
        );
        const articleIds = featuredResult.rows[0]?.article_ids;
        
        const articles = [];
        if (articleIds && articleIds.length) {
            const articlesResult = await pool.query(
                `SELECT * FROM article WHERE id = ANY($1)`, [articleIds]
            );
            articles.push(...articlesResult.rows);
        }

        res.json(articles);
    } catch (err) {
        console.error('Error fetching featured articles', err.stack);
        res.status(500).send('Error fetching featured articles');
    }
});

app.post('/update-featured-status', async (req, res) => {
    const { articleId, shouldBeFeatured } = req.body;

    try {
        // Fetch the current array of featured article IDs
        const fetchResult = await pool.query('SELECT article_ids FROM featured LIMIT 1');
        let currentFeaturedIds = fetchResult.rows[0]?.article_ids || [];

        if (shouldBeFeatured) {
            // Add the article ID to the array if it's not already included
            if (!currentFeaturedIds.includes(articleId)) {
                currentFeaturedIds.push(articleId);
            }
        } else {
            // Remove the article ID from the array if it's currently included
            currentFeaturedIds = currentFeaturedIds.filter(id => id !== articleId);
        }

        // Update the featured article IDs in the database
        await pool.query(
            'UPDATE featured SET article_ids = $1 WHERE id = 1',
            [currentFeaturedIds]
        );

        res.json({ message: 'Featured articles updated successfully.' });
    } catch (err) {
        console.error('Error updating featured articles:', err.stack);
        res.status(500).json({ error: 'Error updating featured articles' });
    }
});

app.get('/get-article/:id', async (req, res) => {
    const articleId = req.params.id;

    try {
        // Assuming your articles are stored in a table named 'article'
        const queryResult = await pool.query('SELECT * FROM article WHERE id = $1', [articleId]);

        if (queryResult.rows.length > 0) {
            res.json(queryResult.rows[0]); // Send the article as a JSON response
        } else {
            res.status(404).send('Article not found');
        }
    } catch (error) {
        console.error('Error fetching article by ID:', error);
        res.status(500).send('Internal Server Error');
    }
});

// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY, // Recommended to use an environment variable for the API key
//   });
// const openai = new OpenAIApi(configuration);

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });

app.post('/article-summarize', async (req, res) => {
    const { content } = req.body; // Assuming 'content' holds the article text

    console.log(content);
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Update this to the specific GPT-4 model you're using
            messages: [{ role: "system", content: "You read long scientific articles and state the main point or conclusion from the article, in one sentence. HARD Maximum of 280 characters" },
                    //     { role: "user", content: "Background: The publication norms of the American Psychological Association recommend the use of a serif font in the manuscripts (Times New Roman). However, there seems to be no well-substantiated reason why serif fonts would produce any advantage during letter/word processing. Method: This study presents an experiment in which sentences were presented either with a serif or sans serif font from the same family while participants' eye movements were monitored. Results: Results did not reveal any differences of type of font in eye movement measures -except for a minimal effect in the number of progressive saccades. Conclusions: There is no reason why the APA publication norms recommend the use of serif fonts other than uniformity in the elaboration/presentation of the manuscripts." },
                    //    {role: "assistant", content: "The choosing of serif for APA publication norms is not supported by tangible differences."},
                       { role: "user", content }]
            // stream: true, // Use if you're handling streaming responses
          });
        

        // Sending back the summary generated
        console.log(response.choices[0].message.content.trim());
        res.json({ summary: response.choices[0].message.content.trim() });
    } catch (error) {
        console.error('Error calling the OpenAI API:', error);
        res.status(500).json({ message: 'Failed to summarize article' });
    }
});

async function summarizeArticle(content) {
    try {
        const response = await axios.post('http://localhost:3000/article-summarize', { content });
        if(response.data && response.data.summary) {
            return response.data.summary;
        } else {
            throw new Error('Failed to get summary');
        }
    } catch (error) {
        console.error('Error summarizing article:', error);
        throw error; // Rethrow or handle as needed
    }
}

async function simplifyArticle(content, lengthString) {
    try {
        const response = await axios.post('http://localhost:3000/article-simplify', { content, lengthString });
        console.log("RESPONSE: ",response.data.simplified);
        if (response.data && response.data.simplified) {
            return response.data.simplified;
        } else {
            console.log("failed to simplify");
            throw new Error('Failed to simplify article');
        }
    } catch (error) {
        console.error('Error simplifying article:', error);
        throw error; // Rethrow or handle as needed
    }
}



app.post('/article-simplify', async (req, res) => {
    const { content, lengthString } = req.body; // Extract content and lengthString from the request body

    console.log(`Content: ${content}`);
    console.log(`Length String: ${lengthString}`);

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Update to the specific GPT-4 model you're using
            messages: [
                { role: "system", content: `You read long scientific articles and simplify them to ${lengthString}.` },
                { role: "user", content }
            ]
        });

        const simplifiedContent = response.choices[0].message.content.trim();

        // Send back the simplified content
        res.json({ simplified: simplifiedContent });
    } catch (error) {
        console.error('Error calling the OpenAI API:', error);
        res.status(500).json({ message: 'Failed to simplify article' });
    }
});


app.post('/create-account', async (req, res) => {
    console.log("got here, pt. 0");
    const { firstName, lastName, email, password } = req.body;
    console.log("got here, pt. 1");
    // argon2
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("got here, pt. 2");
    try {
        const result = await pool.query(
            'INSERT INTO email_credentials (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *;',
            [firstName, lastName, email, passwordHash]
        );
        console.log("got here, pt. 3");
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating account:', error);
        if (error.code === '23505') { // Unique violation error code
            res.status(409).json({ error: 'Email already in use.' });
        } else {
            res.status(500).json({ error: 'Failed to create account' });
        }
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/login', async (req, res) => {
    console.log(req.session)
    const { email, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM email_credentials WHERE email = $1', [email]);
        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            const match = await bcrypt.compare(password, user.password_hash);
            if (match) {
                // Check if the user is an admin
                const adminCheckResult = await pool.query('SELECT * FROM admin_users WHERE email = $1', [email]);
                const isAdmin = adminCheckResult.rowCount > 0;


                // Save user info and admin status in session
                if(!req.session.user){
                    console.log("No session user")
                
                    req.session.user = { email: user.email, isAdmin: isAdmin , isLoggedIn: true };
                    console.log("req session user",req.session.user)
                    console.log("req session",req.session);
                    req.session.save();
                    }
                // Include isAdmin flag in response for frontend to use
                res.json({ message: 'Login successful', isAdmin: isAdmin , isLoggedIn: true, email: user.email});
            } else {
                res.status(401).send('Password incorrect');
            }
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error during login process:', error);
        res.status(500).json({ error: 'An error occurred during the login process' });
    }
});


app.post('/logout', (req, res) => {
    req.session.loggedIn = false;
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/some-page'); // Redirect to a page
        }
        res.clearCookie('connect.sid'); // Depending on your session store, you may not need this
        res.redirect('/login');
    });
});

app.get('/api/session', (req, res) => {
    console.log("REQ.SESSION",req.session);
    console.log("REQ.USER",req.session.user);
    
    if (req.session.user) {
        res.json({ isLoggedIn: true, email: req.session.user.email, isAdmin: req.session.user.isAdmin });
    } else {
        console.log("NO SESSION?")
        res.json({ isLoggedIn: false });
    }
});


// app.get('/', (req, res) => {
//     res.render('website', { // Assuming you're using a template engine
//         user: req.session.user
//     });
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const nodemailer = require('nodemailer');
const e = require('express');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // For example, Gmail. Use your email service here.
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
    },
});

app.post('/send-inquiry', async (req, res) => {
    const { name, email, message } = req.body;
    console.log("nem",name,email,message);
    // const mailOptions = {
    //     from: email,
    //     to: process.env.EMAIL_USER, // Where you want to receive messages
    //     subject: 'New Inquiry from Contact Form',
    //     text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         console.log(error);
    //         res.status(500).send('Error sending email');
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //         res.send('Inquiry sent successfully');
    //     }
    // });
});


app.post('/request-article', async (req, res) => {
    const { articleLink } = req.body;

    // Insert into the database
    const queryText = 'INSERT INTO requested_articles(article_link) VALUES($1) RETURNING *';
    try {
        const result = await pool.query(queryText, [articleLink]);
        // Optionally, send an email notification here using Nodemailer
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error requesting article');
    }
});


app.post('/report-bug', upload.single('bugFile'), async (req, res) => {
    const { name, email, description } = req.body;
    const file = req.file; // Access the uploaded file information

    // Configure the email to include the file if uploaded
    const mailOptions = {
        from: email,
        to: 'your_bug_report_email@example.com',
        subject: 'New Bug Report',
        text: `Name: ${name}\nEmail: ${email}\nDescription: ${description}`,
        attachments: [
            {
                filename: file.originalname,
                path: file.path,
            },
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error reporting bug');
        } else {
            console.log('Bug report sent: ' + info.response);
            res.send('Bug reported successfully');
        }
    });
});




// Example protected route
app.get('/admin-page', requireAdmin, (req, res) => {
    // Your logic here. You could serve an admin page or data
    res.send('Welcome, Admin!');
});

// Apply this middleware to all admin routes
app.get('/admin/add-article', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '/articles/add'));
});

app.get('/admin/update-featured', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '/featured/update'));
});

// app.get('/admin/update-featured', requireAdmin, (req, res) => { //OLD VERSION
//     res.sendFile(path.join(__dirname, '/update_featured.html'));
// });

app.get('/search-articles', async (req, res) => {
    const searchQuery = req.query.q; // Assume the search term is passed as a query parameter "q"

    try {
        // Basic SQL search query (PostgreSQL syntax) - adjust according to your database and requirements
        const queryResult = await pool.query(
            `SELECT * FROM article WHERE 
            LOWER(title) LIKE LOWER($1) OR 
            LOWER(summary) LIKE LOWER($1)`,
            [`%${searchQuery}%`]
        );
        console.log(queryResult.rows);
        res.json(queryResult.rows);
    } catch (error) {
        console.error('Error searching articles:', error);
        res.status(500).send('Error searching articles');
    }
});

app.post('/update-article', async (req, res) => {
    const { id, title, tags, innertext, summary, article_link } = req.body;
    try {
        await pool.query(
            'UPDATE article SET title = $1, tags = $2, innertext = $3, summary = $4, article_link = $5 WHERE id = $6',
            [title, tags, innertext, summary, article_link, id]
        );
        res.json({ success: true, message: 'Article updated successfully!' });
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



app.get('/get-pending-article/:id', requireAdmin, async (req, res) => {
    const articleId = req.params.id;

    try {
        // Query the pending_article table for the article with the specified ID
        const queryResult = await pool.query('SELECT * FROM pending_article WHERE id = $1', [articleId]);

        if (queryResult.rows.length > 0) {
            res.json(queryResult.rows[0]); // Send the article as a JSON response
        } else {
            res.status(404).send('Article not found');
        }
    } catch (error) {
        console.error('Error fetching pending article by ID:', error);
        res.status(500).send('Internal Server Error');
    }
});
