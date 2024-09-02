const express = require('express');
const db = require('./database'); // Importar la conexión a la base de datos
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;  // Puerto que coincidirá con la configuración de reglas de entrada

// Middleware para analizar solicitudes `application/json`
app.use(bodyParser.json());

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
