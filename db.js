const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '202.10.41.174',
    user: 'root',
    password: 'ontageniT1!',
    database: 'crud_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected');
});

module.exports = db;
