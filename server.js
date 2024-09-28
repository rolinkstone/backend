const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import the db connection

const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating tokens
// If needed for other routes

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
//const barangRoutes = require('./routes/barang');
//const salesRoutes = require('./routes/sales');
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const suppliersRoutes = require('./routes/suppliers');
const customersRoutes = require('./routes/customers');
const paymentsRoutes = require('./routes/payments');
const salesRoutes = require('./routes/sales');


// Use routes
//app.use('/api/barang', barangRoutes);
//app.use('/api/sales', salesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/sales', salesRoutes);



// User Login route (implement here as needed)
// User Login

// User Login
app.post('http://202.10.41.174:5000/api/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
                    res.json({ message: 'Login successful', token });
                } else {
                    res.status(401).json({ message: 'Invalid credentials' });
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// Logout route
app.post('/api/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
