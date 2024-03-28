const express = require('express');
const Category = require('../models/categories');
const verifyAccessToken = require('../middlewares/authenticateToken');
const router = express.Router();

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

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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

router.get('/:id', getCategory, (req, res) => {
    res.json(res.category);
});

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

router.delete('/:id', getCategory, async (req, res) => {
    try {
        await res.category.remove();
        res.json({ message: 'Deleted Category' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
