const sqlite3 = require('sqlite3').verbose();

// Create database connection and table setup
const db = new sqlite3.Database('students.sqlite');

// Create table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    gender TEXT NOT NULL,
    age TEXT
  )`);
});

module.exports = db;

