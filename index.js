const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path'); // Import path to serve static files
const app = express();
const port = 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Use body-parser to handle JSON payloads
app.use(bodyParser.json());

// Path to your JSON database
const dbFilePath = './data.json';

// Helper function to read the database
const readDatabase = () => {
    if (fs.existsSync(dbFilePath)) {
        const data = fs.readFileSync(dbFilePath);
        return JSON.parse(data);
    }
    return { users: [], posts: [] }; // Default structure if no data exists
};

// Helper function to write to the database
const writeDatabase = (data) => {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

// API routes
app.get('/users', (req, res) => {
    const data = readDatabase();
    res.json(data.users);
});

app.post('/users', (req, res) => {
    const data = readDatabase();
    const newUser = req.body;

    if (!newUser.name || !newUser.email) {
        return res.status(400).json({ message: "Name and email are required." });
    }

    newUser.id = Date.now();  // Using timestamp as a unique user ID
    data.users.push(newUser);
    writeDatabase(data);
    res.status(201).json(newUser);
});

app.get('/posts', (req, res) => {
    const data = readDatabase();
    res.json(data.posts);
});

app.post('/posts', (req, res) => {
    const data = readDatabase();
    const newPost = req.body;

    if (!newPost.userId || !newPost.content) {
        return res.status(400).json({ message: "User ID and content are required." });
    }

    newPost.id = Date.now();  // Using timestamp as a unique post ID
    data.posts.push(newPost);
    writeDatabase(data);
    res.status(201).json(newPost);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
