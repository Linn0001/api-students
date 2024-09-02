const db = require('./db');

// Función para obtener todos los estudiantes
function getAllStudents() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM students";
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Función para obtener un estudiante por ID
function getStudentById(id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM students WHERE id = ?";
        db.get(query, [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// Función para agregar un nuevo estudiante
function addStudent(firstname, lastname, gender, age) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)";
        db.run(query, [firstname, lastname, gender, age], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: this.lastID,
                    firstname,
                    lastname,
                    gender,
                    age
                });
            }
        });
    });
}

// Función para actualizar un estudiante
function updateStudent(id, firstname, lastname, gender, age) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?";
        db.run(query, [firstname, lastname, gender, age, id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id,
                    firstname,
                    lastname,
                    gender,
                    age
                });
            }
        });
    });
}

// Función para eliminar un estudiante
function deleteStudent(id) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM students WHERE id = ?";
        db.run(query, [id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    getAllStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent
};
