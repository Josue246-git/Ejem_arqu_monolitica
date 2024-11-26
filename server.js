import express from 'express';
import mysql from 'mysql2/promise';
import dotnev from 'dotenv';
import cors from 'cors';

dotnev.config();

const app = express();
app.use(express.json());
app.use(cors());

// Configuración de la base de datos
const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

console.log('Conexión a la base de datos establecida.');

// RUTAS CRUD

// Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Obtener un usuario por ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// Crear un nuevo usuario
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const [result] = await db.query('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', [
      name,
      email,
      age,
    ]);
    res.status(201).json({ id: result.insertId, name, email, age });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Actualizar un usuario
app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const [result] = await db.query('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', [
      name,
      email,
      age,
      req.params.id,
    ]);
    res.json({ id: req.params.id, name, email, age });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// Eliminar un usuario
app.delete('/api/users/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
