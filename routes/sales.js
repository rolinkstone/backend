const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db is exported from a db.js file

// Middleware to verify token
const verifyToken = require('../middleware/verifyToken');

// Get All Barang (protected)verifyToken,
router.get('/', (req, res) => {
    db.query(`
        SELECT s.*, si.sale_id, si.product_id, si.quantity, si.price_item, si.discount, si.subtotal
        FROM sales s
        LEFT JOIN sales_item si ON s.id = si.sale_id
    `, (err, results) => {
        if (err) {
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal Server Error',
                data: null
            });
        }
        
        // Grouping results by sale_id for easier access
        const salesData = results.reduce((acc, row) => {
            const saleId = row.id;
            if (!acc[saleId]) {
                acc[saleId] = {
                    id: row.id,
                    user_id: row.user_id,
                    customer_id: row.customer_id,
                    sale_date: row.sale_date,
                    total_amount: row.total_amount,
                    tax: row.tax,
                    final_amount: row.final_amount,
                    payment_method: row.payment_method,
                    status: row.status,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    items: []
                };
            }
            // Only push items if there are any
            if (row.sale_id) {
                acc[saleId].items.push({
                    sale_id: row.sale_id,
                    product_id: row.product_id,
                    quantity: row.quantity,
                    price_item: row.price_item,
                    discount: row.discount,
                    subtotal: row.subtotal
                });
            }
            return acc;
        }, {});

        res.status(200).json({
            statusCode: 200,
            message: 'Data retrieved successfully',
            data: Object.values(salesData)
        });
    });
});



// Create sales
router.post('/', (req, res) => {
    const { user_id, customer_id, sale_date, total_amount, tax, final_amount, payment_method, status, items } = req.body;

    // First, insert the sale data
    db.query(
        `INSERT INTO sales (user_id, customer_id, sale_date, total_amount, tax, final_amount, payment_method, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, customer_id, sale_date, total_amount, tax, final_amount, payment_method, status],
        (err, result) => {
            if (err) {
                console.error('Error inserting sale:', err);  // Log the error
                return res.status(500).json({
                    statusCode: 500,
                    message: 'Internal Server Error',
                    data: null
                });
            }

            const saleId = result.insertId; // Get the ID of the newly inserted sale

            // Prepare items for batch insertion
            const saleItems = items.map(item => [
                saleId,  // sale_id
                item.product_id,
                item.quantity,
                item.price_item,
                item.discount,
                item.subtotal
            ]);

            // Insert sales items
            if (saleItems.length > 0) {
                db.query(
                    `INSERT INTO sales_item (sale_id, product_id, quantity, price_item, discount, subtotal) VALUES ?`,
                    [saleItems],
                    (err) => {
                        if (err) {
                            console.error('Error inserting sale items:', err); // Log the error
                            return res.status(500).json({
                                statusCode: 500,
                                message: 'Internal Server Error while inserting items',
                                data: null
                            });
                        }

                        res.status(201).json({
                            statusCode: 201,
                            message: 'Sale and items inserted successfully',
                            data: { sale_id: saleId }
                        });
                    }
                );
            } else {
                // If there are no items, just return the sale ID
                res.status(201).json({
                    statusCode: 201,
                    message: 'Sale inserted successfully, but no items provided',
                    data: { sale_id: saleId }
                });
            }
        }
    );
});



// Update Barang
router.put('/:id', verifyToken, (req, res) => {
    const { user_id, customer_id, sale_date, total_amount, discount, tax, final_amount, payment_method, status } = req.body;
    const { id } = req.params;
  
    // Update sales table
    db.query('UPDATE sales SET user_id = ?, customer_id = ?, sale_date = ?, total_amount = ?, discount = ?, tax = ?, final_amount = ?, payment_method = ?, status = ? WHERE id = ?', [user_id, customer_id, sale_date, total_amount, discount, tax, final_amount, payment_method, status, id], (err, result) => {
      if (err) throw err;
  
      // Update sales_items table
      const salesItems = req.body.sales_items;
      if (salesItems) {
        salesItems.forEach((item) => {
          db.query('UPDATE sales_items SET product_id = ?, quantity = ?, price = ?, price_item = ?, discount = ?, subtotal = ? WHERE sale_id = ? AND product_id = ?', [item.product_id, item.quantity, item.price, item.price_item, item.discount, item.subtotal, id, item.product_id], (err, result) => {
            if (err) throw err;
          });
        });
      }
  
      res.json(result);
    });
  });

  
// Delete Barang
router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM sales WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});


module.exports = router;
