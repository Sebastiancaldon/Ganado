const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const SECRET = "ganado_secret"; // Puedes moverlo a .env luego

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { cedula, password } = req.body;

    // Buscar usuario por cédula
    const user = await Usuario.findOne({ where: { cedula } });
    if (!user) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    // Comparar contraseña
    const passwordValida = await bcrypt.compare(password, user.password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Crear token solo si la contraseña es válida
    const token = jwt.sign(
      { id: user.id, nombre: user.nombre },
      SECRET,
      { expiresIn: '1h' }
    );

    // Enviar token al frontend
    res.json({ mensaje: 'Login exitoso', token });

  } catch (error) { 
    res.status(500).json({ error: error.message });
  }
});
router.post('/register', async (req, res) => {
  try {
    const { nombre, cedula, password } = req.body;

    if (!nombre || !cedula || !password) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    // Verifica si ya existe un usuario con esa cédula
    const existente = await Usuario.findOne({ where: { cedula } });
    if (existente) {
      return res.status(409).json({ mensaje: 'Ya existe un usuario con esa cédula' });
    }

    const hash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      cedula,
      password: hash
    });

    res.status(201).json({ mensaje: 'Usuario registrado correctamente', userId: nuevoUsuario.id });
  } catch (error) {
    console.error("❌ Error en registro:", error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;

