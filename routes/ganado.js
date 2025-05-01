const express = require("express");
const router = express.Router();
const { Ganado } = require("../models");
const { verificarToken } = require('../middlewares/authMiddleware'); // ✅ Solo una vez
const jwt = require('jsonwebtoken');

// Registrar nuevo ganado
router.post('/registrar', verificarToken, async (req, res) => {
  try {
    const nuevoGanado = await Ganado.create({
      ...req.body,
      usuario_id: req.user.id
    });
    res.status(201).json(nuevoGanado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener ganado por usuario
router.get('/', verificarToken, async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const ganado = await Ganado.findAll({
      where: { usuario_id: usuarioId }
    });
    res.json(ganado);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener ganado', error: err.message });
  }
});

// Eliminar animal
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const animal = await Ganado.findByPk(id);
    if (!animal) return res.status(404).json({ error: "Animal no encontrado" });

    await animal.destroy();
    res.status(200).json({ message: "Ganado eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
