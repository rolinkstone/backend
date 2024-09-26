const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db is exported from a db.js file

// Middleware to verify token
const verifyToken = require('../middleware/verifyToken');
// In your Product model

// Get All Barang (protected) verifyToken,
// Get All Barang (protected) verifyToken,
router.get('/', verifyToken, (req, res) => {
    const query = `
        SELECT products.*, suppliers.supplier_name, categories.category_name 
        FROM products 
        LEFT JOIN suppliers ON products.supplier_id = suppliers.id
        LEFT JOIN categories ON products.category_id = categories.id
    `;

    db.query(query, (err, results) => {
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
    const { product_name, category_id, supplier_id, price, cost_price, stock, reorder_level, barcode, description} = req.body;
    db.query('INSERT INTO products (product_name, category_id, supplier_id, price, cost_price, stock, reorder_level, barcode, description ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [product_name, category_id, supplier_id, price, cost_price, stock, reorder_level, barcode, description], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId });
    });
});
// Update products
router.put('/:id', verifyToken, (req, res) => {
    const { product_name, category_id, supplier_id, price, cost_price, stock, reorder_level, barcode, description } = req.body;
    const { id } = req.params;
    db.query('UPDATE products SET product_name = ?, category_id = ?, supplier_id = ?, price = ?, cost_price = ?, stock = ?, reorder_level = ?, barcode = ?, description = ? WHERE id = ?', [product_name, category_id, supplier_id, price, cost_price, stock, reorder_level, barcode, description, id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Delete products
router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

module.exports = router;
