const express = require('express');
const students = require('./students'); // Importar las funciones desde students.js
const app = express();
const PORT = 3000; // Cambiar el puerto a 3000

app.use(express.json());

// Obtener todos los estudiantes
app.get('/students', async (req, res) => {
    try {
        const allStudents = await students.getAllStudents();
        res.json(allStudents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener un estudiante por ID
app.get('/students/:id', async (req, res) => {
    try {
        const student = await students.getStudentById(req.params.id);
        if (student) {
            res.json(student);
        } else {
            res.status(404).send('Student not found');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Agregar un nuevo estudiante
app.post('/students', async (req, res) => {
    try {
        const { firstname, lastname, gender, age } = req.body;
        const newStudent = await students.addStudent(firstname, lastname, gender, age);
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar un estudiante
app.put('/students/:id', async (req, res) => {
    try {
        const { firstname, lastname, gender, age } = req.body;
        const updatedStudent = await students.updateStudent(req.params.id, firstname, lastname, gender, age);
        res.json(updatedStudent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar un estudiante
app.delete('/students/:id', async (req, res) => {
    try {
        await students.deleteStudent(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
