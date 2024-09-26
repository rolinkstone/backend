const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db is exported from a db.js file

// Middleware to verify token
const verifyToken = require('../middleware/verifyToken');

// Get All Barang (protected)
router.get('/', verifyToken, (req, res) => {
    db.query('SELECT * FROM barang', (err, results) => {
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

// Create Barang
router.post('/', (req, res) => {
    const { nama_barang, jumlah, harga } = req.body;
    db.query('INSERT INTO barang (nama_barang, jumlah, harga) VALUES (?, ?, ?)', [nama_barang, jumlah, harga], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId });
    });
});

// Update Barang
router.put('/:id', (req, res) => {
    const { nama_barang, jumlah, harga } = req.body;
    const { id } = req.params;
    db.query('UPDATE barang SET nama_barang = ?, jumlah = ?, harga = ? WHERE id = ?', [nama_barang, jumlah, harga, id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Delete Barang
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM barang WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

module.exports = router;
