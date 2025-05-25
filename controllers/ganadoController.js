const { Ganado, Produccion } = require("../models")
const { Op } = require("sequelize")

// Obtener todos los registros de ganado
exports.getAllGanado = async (req, res) => {
  try {
    const { raza, sexo, estado, sort } = req.query

    // Construir condiciones de filtrado
    // IMPORTANTE: Siempre filtrar por usuarioId para garantizar Object Level Authorization
    const where = { usuarioId: req.usuario.id }

    if (raza) where.raza = raza
    if (sexo) where.sexo = sexo
    if (estado) where.estado = estado

    // Construir opciones de ordenamiento
    let order = [["createdAt", "DESC"]]
    if (sort) {
      const [field, direction] = sort.split(":")
      if (field && direction) {
        order = [[field, direction.toUpperCase()]]
      }
    }

    const ganado = await Ganado.findAll({
      where,
      order,
      include: [
        {
          model: Produccion,
          as: "produccion",
          limit: 5,
          order: [["fechaRegistro", "DESC"]],
        },
      ],
    })

    res.status(200).json({
      success: true,
      count: ganado.length,
      data: ganado,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener registros de ganado",
      error: error.message,
    })
  }
}

// Obtener un registro de ganado por ID
exports.getGanadoById = async (req, res) => {
  try {
    // El middleware verifyGanadoOwnership ya verificó la propiedad
    // y añadió el ganado al objeto request
    if (req.ganado) {
      // Obtener datos completos con producción
      const ganado = await Ganado.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: Produccion,
            as: "produccion",
            order: [["fechaRegistro", "DESC"]],
          },
        ],
      })

      return res.status(200).json({
        success: true,
        data: ganado,
      })
    } else {
      // Este caso no debería ocurrir si el middleware funciona correctamente
      return res.status(404).json({
        success: false,
        message: "Registro de ganado no encontrado",
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener registro de ganado",
      error: error.message,
    })
  }
}

// Crear un nuevo registro de ganado
exports.createGanado = async (req, res) => {
  try {
    const { identificacion, raza, fechaNacimiento, sexo, peso, estado } = req.body

    // Verificar si ya existe un animal con la misma identificación
    const existingGanado = await Ganado.findOne({
      where: { identificacion },
    })

    if (existingGanado) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un animal con esta identificación",
      })
    }

    // Asegurar que el usuarioId sea el del usuario autenticado
    const ganado = await Ganado.create({
      usuarioId: req.usuario.id, // Garantizar que siempre se use el ID del usuario autenticado
      identificacion,
      raza,
      fechaNacimiento,
      sexo,
      peso,
      estado: estado || "Activo",
    })

    res.status(201).json({
      success: true,
      message: "Registro de ganado creado exitosamente",
      data: ganado,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear registro de ganado",
      error: error.message,
    })
  }
}

// Actualizar un registro de ganado
exports.updateGanado = async (req, res) => {
  try {
    const { identificacion, raza, fechaNacimiento, sexo, peso, estado } = req.body

    // El middleware verifyGanadoOwnership ya verificó la propiedad
    // y añadió el ganado al objeto request
    if (!req.ganado) {
      return res.status(404).json({
        success: false,
        message: "Registro de ganado no encontrado",
      })
    }

    // Si se está actualizando la identificación, verificar que no exista otro animal con esa identificación
    if (identificacion && identificacion !== req.ganado.identificacion) {
      const existingGanado = await Ganado.findOne({
        where: {
          identificacion,
          id: { [Op.ne]: req.params.id },
        },
      })

      if (existingGanado) {
        return res.status(400).json({
          success: false,
          message: "Ya existe un animal con esta identificación",
        })
      }
    }

    // Actualizar el registro
    await req.ganado.update({
      identificacion: identificacion || req.ganado.identificacion,
      raza: raza || req.ganado.raza,
      fechaNacimiento: fechaNacimiento || req.ganado.fechaNacimiento,
      sexo: sexo || req.ganado.sexo,
      peso: peso || req.ganado.peso,
      estado: estado || req.ganado.estado,
      // No permitir actualizar usuarioId para evitar transferencia de propiedad
    })

    res.status(200).json({
      success: true,
      message: "Registro de ganado actualizado exitosamente",
      data: req.ganado,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar registro de ganado",
      error: error.message,
    })
  }
}

// Eliminar un registro de ganado
exports.deleteGanado = async (req, res) => {
  try {
    // El middleware verifyGanadoOwnership ya verificó la propiedad
    // y añadió el ganado al objeto request
    if (!req.ganado) {
      return res.status(404).json({
        success: false,
        message: "Registro de ganado no encontrado",
      })
    }

    // Eliminar el registro
    await req.ganado.destroy()

    res.status(200).json({
      success: true,
      message: "Registro de ganado eliminado exitosamente",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar registro de ganado",
      error: error.message,
    })
  }
}
