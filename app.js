const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 8000;

// Middleware para analizar solicitudes `application/x-www-form-urlencoded`
app.use(bodyParser.urlencoded({ extended: true }));

// Crear conexión a la base de datos SQLite
const db = new sqlite3.Database('students.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        gender TEXT NOT NULL,
        age INTEGER NOT NULL
    )`);
  }
});

// Ruta para obtener todos los estudiantes o agregar uno nuevo
app.route('/students')
  .get((req, res) => {
    const sql = 'SELECT * FROM students';
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    });
  })
  .post((req, res) => {
    const { firstname, lastname, gender, age } = req.body;
    const sql = 'INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)';
    db.run(sql, [firstname, lastname, gender, age], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send(`Estudiante con ID: ${this.lastID} creado exitosamente.`);
      }
    });
  });

// Ruta para obtener, actualizar o eliminar un estudiante por ID
app.route('/student/:id')
  .get((req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM students WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (row) {
        res.json(row);
      } else {
        res.status(404).send('Estudiante no encontrado');
      }
    });
  })
  .put((req, res) => {
    const { id } = req.params;
    const { firstname, lastname, gender, age } = req.body;
    const sql = 'UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?';
    db.run(sql, [firstname, lastname, gender, age, id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes > 0) {
        res.json({ id, firstname, lastname, gender, age });
      } else {
        res.status(404).send('Estudiante no encontrado');
      }
    });
  })
  .delete((req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM students WHERE id = ?';
    db.run(sql, [id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes > 0) {
        res.send(`El estudiante con ID: ${id} ha sido eliminado.`);
      } else {
        res.status(404).send('Estudiante no encontrado');
      }
    });
  });

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
