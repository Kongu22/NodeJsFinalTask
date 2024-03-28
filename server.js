const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// Assuming the structure provided in your files, adjust the paths as necessary
const tasksRoutes = require('./routes/tasksRoutes');
const userRoutes = require('./routes/userRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const app = express();
const port = 3000;

// Database connection
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

app.use(express.json()); // For parsing application/json
app.use(cookieParser());

// Routes
app.use('/tasks', tasksRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoriesRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Catch-all for non-existing routes
app.use('*', (req, res) => {
    res.status(404).send('404 Not Found');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
