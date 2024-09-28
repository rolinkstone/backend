const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'http://202.10.41.174:5000',
    user: 'root',
    password: 'ontageniT1!',
    database: 'crud_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected');
});

module.exports = db;
