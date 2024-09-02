const sqlite3 = require('sqlite3').verbose();

// Crear la conexión a la base de datos
const db = new sqlite3.Database('./students.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');

    // Crear la tabla "students" si no existe
    const sql_query = `
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        gender TEXT NOT NULL,
        age TEXT
      )
    `;

    db.run(sql_query, (err) => {
      if (err) {
        console.error('Error creando la tabla:', err.message);
      } else {
        console.log('Tabla "students" creada o ya existe.');
      }
    });
  }
});

module.exports = db;
