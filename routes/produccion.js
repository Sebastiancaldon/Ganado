const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const produccionController = require('../controllers/produccionController'); // Asegúrate que exista

router.post('/registrar', verificarToken, produccionController.registrarProduccion); // ✅ Correcto


module.exports = router;
