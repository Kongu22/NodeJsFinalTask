const express = require('express');
const mongoose = require('mongoose');
const tasksRoutes = require('./routes/tasksRoutes'); // Путь к файлу с маршрутами задач
const userRoutes = require('./routes/userRoutes'); // Путь к файлу с маршрутами пользователей, если он у вас есть
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');

// Подключение к MongoDB
mongoose.connect('mongodb://localhost/mydatabase1', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

app.use(express.json()); // Для разбора JSON-тел запросов
app.use(cookieParser());

// Маршруты
app.use('/tasks', tasksRoutes); 
app.use('/users', userRoutes); // Если у вас есть обработчики маршрутов пользователей

// Корневой эндпоинт
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
