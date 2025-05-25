const express = require("express")
const router = express.Router()
const ganadoController = require("../controllers/ganadoController")
const authMiddleware = require("../middlewares/auth")
const { verifyGanadoOwnership } = require("../middlewares/objectLevelAuth")

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware)

/**
 * @swagger
 * /api/ganado:
 *   get:
 *     summary: Obtener todos los registros de ganado
 *     tags: [Ganado]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: raza
 *         schema:
 *           type: string
 *         description: Filtrar por raza
 *       - in: query
 *         name: sexo
 *         schema:
 *           type: string
 *           enum: [Macho, Hembra]
 *         description: Filtrar por sexo
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [Activo, Vendido, Fallecido]
 *         description: Filtrar por estado
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Ordenar resultados (ej. peso:asc)
 *     responses:
 *       200:
 *         description: Lista de registros de ganado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/", ganadoController.getAllGanado)

/**
 * @swagger
 * /api/ganado/{id}:
 *   get:
 *     summary: Obtener un registro de ganado por ID
 *     tags: [Ganado]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de ganado
 *     responses:
 *       200:
 *         description: Registro de ganado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No tiene autorización para este recurso
 *       404:
 *         description: Registro no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", verifyGanadoOwnership, ganadoController.getGanadoById)

/**
 * @swagger
 * /api/ganado:
 *   post:
 *     summary: Crear un nuevo registro de ganado
 *     tags: [Ganado]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identificacion
 *               - raza
 *               - fechaNacimiento
 *               - sexo
 *               - peso
 *             properties:
 *               identificacion:
 *                 type: string
 *               raza:
 *                 type: string
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *               sexo:
 *                 type: string
 *                 enum: [Macho, Hembra]
 *               peso:
 *                 type: number
 *               estado:
 *                 type: string
 *                 enum: [Activo, Vendido, Fallecido]
 *     responses:
 *       201:
 *         description: Registro de ganado creado exitosamente
 *       400:
 *         description: Ya existe un animal con esta identificación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post("/", ganadoController.createGanado)

/**
 * @swagger
 * /api/ganado/{id}:
 *   put:
 *     summary: Actualizar un registro de ganado
 *     tags: [Ganado]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de ganado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identificacion:
 *                 type: string
 *               raza:
 *                 type: string
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *               sexo:
 *                 type: string
 *                 enum: [Macho, Hembra]
 *               peso:
 *                 type: number
 *               estado:
 *                 type: string
 *                 enum: [Activo, Vendido, Fallecido]
 *     responses:
 *       200:
 *         description: Registro de ganado actualizado exitosamente
 *       400:
 *         description: Ya existe un animal con esta identificación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No tiene autorización para este recurso
 *       404:
 *         description: Registro no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", verifyGanadoOwnership, ganadoController.updateGanado)

/**
 * @swagger
 * /api/ganado/{id}:
 *   delete:
 *     summary: Eliminar un registro de ganado
 *     tags: [Ganado]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de ganado
 *     responses:
 *       200:
 *         description: Registro de ganado eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No tiene autorización para este recurso
 *       404:
 *         description: Registro no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", verifyGanadoOwnership, ganadoController.deleteGanado)

module.exports = router
