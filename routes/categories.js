const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db is exported from a db.js file

// Middleware to verify token
const verifyToken = require('../middleware/verifyToken');

// Get All Barang (protected)verifyToken,
router.get('/', verifyToken, (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal Server Error',
                data: null
            });
        }
        res.status(200).json({
            statusCode: 200,
            message: 'Data retrieved successfully',
            data: results
        });
    });
});

// Create products
router.post('/', verifyToken, (req, res) => {
    const { category_name, description } = req.body;
    db.query('INSERT INTO categories (category_name, description ) VALUES (?, ?)', [category_name, description], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId });
    });
});
// Update Barang
router.put('/:id', verifyToken, (req, res) => {
    const { category_name, description } = req.body;
    const { id } = req.params;
    db.query('UPDATE categories SET category_name = ?, description = ? WHERE id = ?', [category_name, description, id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Delete Barang
router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM categories WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});
module.exports = router;
