const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = require('./db'); // Import the database setup

const app = express();
const port = 3000; // Set the port to 3000

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get all students
app.get('/students', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

// Create a new student
app.post('/students', (req, res) => {
  const { firstname, lastname, gender, age } = req.body;
  db.run(`INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)`,
    [firstname, lastname, gender, age],
    function (err) {
      if (err) {
        return console.error(err.message);
      }
      res.send(`Student with id: ${this.lastID} created successfully`);
    });
});

// Get a single student by ID
app.get('/student/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
    if (err) {
      throw err;
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).send('Student not found');
    }
  });
});

// Update a student
app.put('/student/:id', (req, res) => {
  const id = req.params.id;
  const { firstname, lastname, gender, age } = req.body;
  db.run(`UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?`,
    [firstname, lastname, gender, age, id],
    function (err) {
      if (err) {
        return console.error(err.message);
      }
      res.json({
        id,
        firstname,
        lastname,
        gender,
        age
      });
    });
});

// Delete a student
app.delete('/student/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM students WHERE id = ?`, [id], function (err) {
    if (err) {
      return console.error(err.message);
    }
    res.send(`The Student with id: ${id} has been deleted.`);
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}/`);
});
