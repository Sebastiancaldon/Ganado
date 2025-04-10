const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/authMiddleware');
const produccionController = require('../controllers/produccionController');

// Registrar producción
router.post('/', verificarToken, produccionController.registrarProduccion);

// Listar producción con filtros
router.get('/', verificarToken, produccionController.listarProduccion);

// Actualizar producción
router.put('/:id', verificarToken, produccionController.actualizarProduccion);

// Eliminar producción
router.delete('/:id', verificarToken, produccionController.eliminarProduccion);

// Reporte por periodo
router.get('/reporte', verificarToken, produccionController.reportePorPeriodo);

module.exports = router;
