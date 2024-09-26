const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db is exported from a db.js file

// Middleware to verify token
const verifyToken = require('../middleware/verifyToken');

// Get All Barang (protected)verifyToken,
router.get('/', verifyToken, (req, res) => {
    db.query('SELECT * FROM suppliers', (err, results) => {
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
    const { supplier_name, contact_person, phone, email, address } = req.body;
    db.query('INSERT INTO suppliers (supplier_name, contact_person, phone, email, address  ) VALUES (?, ?, ?, ?, ?)', [supplier_name, contact_person, phone, email, address ], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId });
    });
});

// Update Barang
router.put('/:id', verifyToken, (req, res) => {
    const { supplier_name, contact_person, phone, email, address } = req.body;
    const { id } = req.params;
    db.query('UPDATE suppliers SET supplier_name = ?, contact_person = ?, phone = ?, email = ?, address = ? WHERE id = ?', [supplier_name, contact_person, phone, email, address, id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Delete Barang
router.delete('/:id',  (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM suppliers WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});
module.exports = router;
