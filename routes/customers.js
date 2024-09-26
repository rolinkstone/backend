const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db is exported from a db.js file

// Middleware to verify token
const verifyToken = require('../middleware/verifyToken');
// In your Product model

// Get All Barang (protected) verifyToken,
// Get All Barang (protected)verifyToken,
router.get('/', verifyToken, (req, res) => {
    db.query('SELECT * FROM customers', (err, results) => {
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
    const { customer_name, email, phone, address, loyalty_points} = req.body;
    db.query('INSERT INTO customers (customer_name, email, phone, address, loyalty_points ) VALUES (?, ?, ?, ?, ?)', [customer_name, email, phone, address, loyalty_points], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId });
    });
});
// Update products
router.put('/:id', verifyToken, (req, res) => {
    const { customer_name, email, phone, address, loyalty_points } = req.body;
    const { id } = req.params;
    db.query('UPDATE customers SET customer_name = ?, email = ?, phone = ?, address = ?, loyalty_points = ? WHERE id = ?', [customer_name, email, phone, address, loyalty_points, id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Delete products
router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM customers WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});



module.exports = router;
