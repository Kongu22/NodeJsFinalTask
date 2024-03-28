const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const tasksRoutes = require('./routes/tasksRoutes');
const userRoutes = require('./routes/userRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

app.use(express.json());
app.use(cookieParser());

app.use('/tasks', tasksRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoriesRoutes);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('*', (req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
