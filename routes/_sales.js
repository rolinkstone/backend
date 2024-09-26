const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db is exported from a db.js file
const verifyToken = require('../middleware/verifyToken');

// Get All Sales (protected)
router.get('/', verifyToken, (req, res) => {
    db.query('SELECT * FROM sales', (err, results) => {
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

// Additional sales routes (create, update, delete) can be added here

module.exports = router;
