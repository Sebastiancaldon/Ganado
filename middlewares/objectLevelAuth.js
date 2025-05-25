/**
 * Middleware para autorización a nivel de objeto (Object Level Authorization)
 * Protege contra API1:2023 - Broken Object Level Authorization
 */

const { Ganado, Produccion } = require("../models")
const { Op } = require("sequelize")

// Middleware para verificar propiedad de un animal (ganado)
const verifyGanadoOwnership = async (req, res, next) => {
  try {
    const ganadoId = req.params.id

    // Si no hay ID, no es necesario verificar
    if (!ganadoId) {
      return next()
    }

    // Buscar el ganado y verificar que pertenezca al usuario autenticado
    const ganado = await Ganado.findOne({
      where: {
        id: ganadoId,
      },
    })

    // Si no existe el ganado, devolver 404
    if (!ganado) {
      return res.status(404).json({
        success: false,
        message: "Registro de ganado no encontrado",
      })
    }

    // Verificar que el ganado pertenezca al usuario autenticado
    if (ganado.usuarioId !== req.usuario.id) {
      // Registrar intento de acceso no autorizado
      console.warn(
        `Intento de acceso no autorizado: Usuario ${req.usuario.id} intentó acceder al ganado ${ganadoId} que pertenece al usuario ${ganado.usuarioId}`,
      )

      return res.status(403).json({
        success: false,
        message: "No tiene autorización para acceder a este recurso",
      })
    }

    // Añadir el ganado al objeto request para uso posterior
    req.ganado = ganado
    next()
  } catch (error) {
    console.error("Error en verificación de propiedad de ganado:", error)
    return res.status(500).json({
      success: false,
      message: "Error al verificar autorización",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    })
  }
}

// Middleware para verificar propiedad de un registro de producción
const verifyProduccionOwnership = async (req, res, next) => {
  try {
    const produccionId = req.params.id

    // Si no hay ID, no es necesario verificar
    if (!produccionId) {
      return next()
    }

    // Buscar el registro de producción
    const produccion = await Produccion.findOne({
      where: {
        id: produccionId,
      },
      include: [
        {
          model: Ganado,
          as: "animal",
          attributes: ["id", "usuarioId"],
        },
      ],
    })

    // Si no existe el registro de producción, devolver 404
    if (!produccion) {
      return res.status(404).json({
        success: false,
        message: "Registro de producción no encontrado",
      })
    }

    // Verificar que el animal asociado a la producción pertenezca al usuario autenticado
    if (!produccion.animal || produccion.animal.usuarioId !== req.usuario.id) {
      // Registrar intento de acceso no autorizado
      console.warn(
        `Intento de acceso no autorizado: Usuario ${req.usuario.id} intentó acceder a la producción ${produccionId} que pertenece al usuario ${
          produccion.animal ? produccion.animal.usuarioId : "desconocido"
        }`,
      )

      return res.status(403).json({
        success: false,
        message: "No tiene autorización para acceder a este recurso",
      })
    }

    // Añadir la producción al objeto request para uso posterior
    req.produccion = produccion
    next()
  } catch (error) {
    console.error("Error en verificación de propiedad de producción:", error)
    return res.status(500).json({
      success: false,
      message: "Error al verificar autorización",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    })
  }
}

// Middleware para verificar propiedad del animal al crear/actualizar producción
const verifyAnimalOwnership = async (req, res, next) => {
  try {
    const animalId = req.body.animalId

    // Si no hay animalId en el cuerpo, no es necesario verificar
    if (!animalId) {
      return next()
    }

    // Buscar el animal y verificar que pertenezca al usuario autenticado
    const ganado = await Ganado.findOne({
      where: {
        id: animalId,
      },
    })

    // Si no existe el animal, devolver 404
    if (!ganado) {
      return res.status(404).json({
        success: false,
        message: "Animal no encontrado",
      })
    }

    // Verificar que el animal pertenezca al usuario autenticado
    if (ganado.usuarioId !== req.usuario.id) {
      // Registrar intento de acceso no autorizado
      console.warn(
        `Intento de acceso no autorizado: Usuario ${req.usuario.id} intentó usar el animal ${animalId} que pertenece al usuario ${ganado.usuarioId}`,
      )

      return res.status(403).json({
        success: false,
        message: "No tiene autorización para usar este animal",
      })
    }

    // Añadir el animal al objeto request para uso posterior
    req.animal = ganado
    next()
  } catch (error) {
    console.error("Error en verificación de propiedad de animal:", error)
    return res.status(500).json({
      success: false,
      message: "Error al verificar autorización",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    })
  }
}

module.exports = {
  verifyGanadoOwnership,
  verifyProduccionOwnership,
  verifyAnimalOwnership,
}
