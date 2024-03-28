const express = require('express');
const Category = require('../models/categories');
const verifyAccessToken = require('../middlewares/authenticateToken');// Assuming you have this middleware
const router = express.Router();

// Create a new category
router.post('/', verifyAccessToken, async (req, res) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description,
        user: req.user._id
    });

    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Fetch all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to find a category by ID
async function getCategory(req, res, next) {
    let category;
    try {
        category = await Category.findById(req.params.id);
        if (category == null) {
            return res.status(404).json({ message: 'Cannot find category' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.category = category;
    next();
}

// Fetch a single category by ID
router.get('/:id', getCategory, (req, res) => {
    res.json(res.category);
});

// Update a category (using PATCH for partial updates)
router.patch('/:id', getCategory, async (req, res) => {
    if (req.body.name != null) {
        res.category.name = req.body.name;
    }
    if (req.body.description != null) {
        res.category.description = req.body.description;
    }

    try {
        const updatedCategory = await res.category.save();
        res.json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a category
router.delete('/:id', getCategory, async (req, res) => {
    try {
        await res.category.remove();
        res.json({ message: 'Deleted Category' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
