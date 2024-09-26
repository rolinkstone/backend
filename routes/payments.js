const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db is exported from a db.js file

// Middleware to verify token
const verifyToken = require('../middleware/verifyToken');

// Get All Barang (protected)verifyToken,
router.get('/', verifyToken, (req, res) => {
    db.query('SELECT * FROM payments', (err, results) => {
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
    const { sale_id, payment_date, amount, payment_method, transaction_reference, status } = req.body;
    db.query('INSERT INTO payments (sale_id, payment_date, amount, payment_method, transaction_reference, status ) VALUES (?, ?, ?, ?, ?, ?)', [sale_id, payment_date, amount, payment_method, transaction_reference, status], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId });
    });
});
// Update Barang
router.put('/:id', verifyToken, (req, res) => {
    const { sale_id, payment_date, amount, payment_method, transaction_reference, status } = req.body;
    const { id } = req.params;
    db.query('UPDATE payments SET sale_id = ?, payment_date = ?, amount = ?, payment_method = ?, transaction_reference = ?, status = ? WHERE id = ?', [sale_id, payment_date, amount, payment_method, transaction_reference, status, id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Delete Barang
router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM payments WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});
module.exports = router;
