const express = require('express');
const Task = require('../models/tasks');
const verifyAccessToken = require('../middlewares/authenticateToken');
const router = express.Router();

// Fetch all tasks with optional filtering
router.get('/', verifyAccessToken, async (req, res) => {
    const query = { user: req.user._id }; // Base query to include only tasks belonging to the authenticated user
    
    // Apply filters if they are provided in the query string
    if (req.query.status) {
        query.status = req.query.status;
    }
    if (req.query.deadline) {
        // Example of a simple filter for tasks on or before a specific deadline
        query.deadline = { $lte: new Date(req.query.deadline) };
    }
    if (req.query.category) {
        query.category = req.query.category;
    }

    try {
        const tasks = await Task.find(query);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new task
router.post('/', verifyAccessToken, async (req, res) =>{
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        deadline: req.body.deadline,
        user: req.user._id,
        category: req.body.category
    });
    
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Middleware to find a task by ID
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

// Update a specific task
router.put('/:id', verifyAccessToken, getTask, async (req, res) => {
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

    try {
        const updatedTask = await res.task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a specific task
router.delete('/:id', verifyAccessToken, getTask, async (req, res) => {
    try {
        await res.task.remove();
        res.json({ message: 'Deleted Task' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;