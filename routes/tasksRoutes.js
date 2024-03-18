const express = require('express');
const router = express.Router();
const Task = require('../models/tasks'); // Убедитесь, что путь к модели задач правильный

// Получение всех задач
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Создание новой задачи
router.post('/', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        deadline: req.body.deadline,
        user: req.body.user // Прямое использование 'user' из тела запроса
    });
    
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Получение задач конкретного пользователя
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId.trim(); // Использование trim() для удаления лишних пробелов и символов перевода строки
        const tasks = await Task.find({ user: userId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Middleware для поиска задачи по ID
async function getTask(req, res, next) {
    let task;
    try {
        task = await Task.findById(req.params.id);
        if (task == null) {
            return res.status(404).json({ message: 'Cannot find task' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.task = task;
    next();
}

// Обновление конкретной задачи
router.put('/:id', getTask, async (req, res) => {
    // Проверяем, есть ли в теле запроса новые значения для каждого поля и обновляем их при необходимости
    if (req.body.title !== undefined) {
        res.task.title = req.body.title;
    }
    if (req.body.description !== undefined) {
        res.task.description = req.body.description;
    }
    if (req.body.status !== undefined) {
        res.task.status = req.body.status;
    }
    if (req.body.deadline !== undefined) {
        res.task.deadline = req.body.deadline;
    }
    // По аналогии можно добавить обновление для других полей

    try {
        // После изменения свойств задачи сохраняем её
        const updatedTask = await res.task.save();
        // Отправляем обновлённую задачу в ответе
        res.json(updatedTask);
    } catch (err) {
        // В случае ошибки во время сохранения отправляем статус 400 с сообщением об ошибке
        res.status(400).json({ message: err.message });
    }
});

// Удаление конкретной задачи
router.delete('/:id', getTask, async (req, res) => {
    try {
        await Task.deleteOne({ _id: res.task._id });
        res.json({ message: 'Deleted Task' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
