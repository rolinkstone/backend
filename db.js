const mysql = require('mysql2'); // Jika kamu menggunakan mysql v1
// Jika kamu menggunakan mysql2 (versi lebih baru), gunakan:
// const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '202.10.41.174',      // IP VPS atau server MySQL
    user: 'root',               // Username MySQL
    password: 'ontageniT1!',     // Password MySQL
    database: 'crud_db',         // Nama database yang digunakan
    port: 3306                   // Tambahkan port jika menggunakan port berbeda, defaultnya 3306
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('MySQL Connected');
});

module.exports = db;
