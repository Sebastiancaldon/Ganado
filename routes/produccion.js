const express = require("express")
const router = express.Router()
const produccionController = require("../controllers/produccionController")
const authMiddleware = require("../middlewares/auth")
const { verifyProduccionOwnership, verifyAnimalOwnership } = require("../middlewares/objectLevelAuth")

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware)

/**
 * @swagger
 * /api/produccion/reporte:
 *   get:
 *     summary: Generar reporte de producción
 *     tags: [Producción]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *           enum: [diario, semanal, mensual]
 *         description: Periodo para el reporte
 *       - in: query
 *         name: tipoProduccion
 *         required: true
 *         schema:
 *           type: string
 *           enum: [leche, carne]
 *         description: Tipo de producción para el reporte
 *     responses:
 *       200:
 *         description: Reporte de producción generado exitosamente
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/reporte", produccionController.getReporteProduccion)

/**
 * @swagger
 * /api/produccion:
 *   get:
 *     summary: Obtener todos los registros de producción
 *     tags: [Producción]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: animalId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID del animal
 *       - in: query
 *         name: tipoProduccion
 *         schema:
 *           type: string
 *           enum: [leche, carne]
 *         description: Filtrar por tipo de producción
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio para filtrar
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para filtrar
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Ordenar resultados (ej. cantidad:desc)
 *     responses:
 *       200:
 *         description: Lista de registros de producción
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/", produccionController.getAllProduccion)

/**
 * @swagger
 * /api/produccion/{id}:
 *   get:
 *     summary: Obtener un registro de producción por ID
 *     tags: [Producción]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de producción
 *     responses:
 *       200:
 *         description: Registro de producción
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No tiene autorización para este recurso
 *       404:
 *         description: Registro no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", verifyProduccionOwnership, produccionController.getProduccionById)

/**
 * @swagger
 * /api/produccion:
 *   post:
 *     summary: Crear un nuevo registro de producción
 *     tags: [Producción]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - animalId
 *               - tipoProduccion
 *               - cantidad
 *             properties:
 *               animalId:
 *                 type: integer
 *               tipoProduccion:
 *                 type: string
 *                 enum: [leche, carne]
 *               cantidad:
 *                 type: number
 *               fechaRegistro:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Registro de producción creado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No tiene autorización para usar este animal
 *       404:
 *         description: Animal no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post("/", verifyAnimalOwnership, produccionController.createProduccion)

/**
 * @swagger
 * /api/produccion/{id}:
 *   put:
 *     summary: Actualizar un registro de producción
 *     tags: [Producción]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de producción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipoProduccion:
 *                 type: string
 *                 enum: [leche, carne]
 *               cantidad:
 *                 type: number
 *               fechaRegistro:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Registro de producción actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No tiene autorización para este recurso
 *       404:
 *         description: Registro no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", verifyProduccionOwnership, produccionController.updateProduccion)

/**
 * @swagger
 * /api/produccion/{id}:
 *   delete:
 *     summary: Eliminar un registro de producción
 *     tags: [Producción]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de producción
 *     responses:
 *       200:
 *         description: Registro de producción eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No tiene autorización para este recurso
 *       404:
 *         description: Registro no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", verifyProduccionOwnership, produccionController.deleteProduccion)

module.exports = router
