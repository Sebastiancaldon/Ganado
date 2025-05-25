const { Produccion, Ganado } = require("../models")
const { Op } = require("sequelize")
const { sequelize } = require("../models")

// Obtener todos los registros de producción
exports.getAllProduccion = async (req, res) => {
  try {
    const { animalId, tipoProduccion, fechaInicio, fechaFin, sort } = req.query

    // Construir condiciones de filtrado
    const where = {}

    if (animalId) where.animalId = animalId
    if (tipoProduccion) where.tipoProduccion = tipoProduccion

    // Filtrar por rango de fechas
    if (fechaInicio || fechaFin) {
      where.fechaRegistro = {}
      if (fechaInicio) where.fechaRegistro[Op.gte] = fechaInicio
      if (fechaFin) where.fechaRegistro[Op.lte] = fechaFin
    }

    // Construir opciones de ordenamiento
    let order = [["fechaRegistro", "DESC"]]
    if (sort) {
      const [field, direction] = sort.split(":")
      if (field && direction) {
        order = [[field, direction.toUpperCase()]]
      }
    }

    // IMPORTANTE: Incluir solo ganado que pertenece al usuario actual para garantizar Object Level Authorization
    const ganado = await Ganado.findAll({
      where: { usuarioId: req.usuario.id },
      attributes: ["id"],
    })

    const animalIds = ganado.map((animal) => animal.id)
    where.animalId = { [Op.in]: animalIds }

    const produccion = await Produccion.findAll({
      where,
      order,
      include: [
        {
          model: Ganado,
          as: "animal",
          attributes: ["id", "identificacion", "raza", "sexo", "usuarioId"],
        },
      ],
    })

    res.status(200).json({
      success: true,
      count: produccion.length,
      data: produccion,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener registros de producción",
      error: error.message,
    })
  }
}

// Obtener un registro de producción por ID
exports.getProduccionById = async (req, res) => {
  try {
    // El middleware verifyProduccionOwnership ya verificó la propiedad
    // y añadió la producción al objeto request
    if (req.produccion) {
      return res.status(200).json({
        success: true,
        data: req.produccion,
      })
    } else {
      // Este caso no debería ocurrir si el middleware funciona correctamente
      return res.status(404).json({
        success: false,
        message: "Registro de producción no encontrado",
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener registro de producción",
      error: error.message,
    })
  }
}

// Crear un nuevo registro de producción
exports.createProduccion = async (req, res) => {
  try {
    const { animalId, tipoProduccion, cantidad, fechaRegistro } = req.body

    // El middleware verifyAnimalOwnership ya verificó la propiedad del animal
    // y añadió el animal al objeto request
    if (!req.animal) {
      return res.status(404).json({
        success: false,
        message: "Animal no encontrado o no pertenece al usuario",
      })
    }

    const produccion = await Produccion.create({
      animalId,
      tipoProduccion,
      cantidad,
      fechaRegistro: fechaRegistro || new Date(),
    })

    res.status(201).json({
      success: true,
      message: "Registro de producción creado exitosamente",
      data: produccion,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear registro de producción",
      error: error.message,
    })
  }
}

// Actualizar un registro de producción
exports.updateProduccion = async (req, res) => {
  try {
    const { tipoProduccion, cantidad, fechaRegistro } = req.body

    // El middleware verifyProduccionOwnership ya verificó la propiedad
    // y añadió la producción al objeto request
    if (!req.produccion) {
      return res.status(404).json({
        success: false,
        message: "Registro de producción no encontrado",
      })
    }

    // Actualizar el registro
    await req.produccion.update({
      tipoProduccion: tipoProduccion || req.produccion.tipoProduccion,
      cantidad: cantidad || req.produccion.cantidad,
      fechaRegistro: fechaRegistro || req.produccion.fechaRegistro,
      // No permitir actualizar animalId para evitar transferencia de propiedad
    })

    res.status(200).json({
      success: true,
      message: "Registro de producción actualizado exitosamente",
      data: req.produccion,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar registro de producción",
      error: error.message,
    })
  }
}

// Eliminar un registro de producción
exports.deleteProduccion = async (req, res) => {
  try {
    // El middleware verifyProduccionOwnership ya verificó la propiedad
    // y añadió la producción al objeto request
    if (!req.produccion) {
      return res.status(404).json({
        success: false,
        message: "Registro de producción no encontrado",
      })
    }

    // Eliminar el registro
    await req.produccion.destroy()

    res.status(200).json({
      success: true,
      message: "Registro de producción eliminado exitosamente",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar registro de producción",
      error: error.message,
    })
  }
}

// Generar reporte de producción
exports.getReporteProduccion = async (req, res) => {
  try {
    const { periodo, tipoProduccion } = req.query

    // Validar parámetros
    if (!periodo || !["diario", "semanal", "mensual"].includes(periodo)) {
      return res.status(400).json({
        success: false,
        message: "Periodo inválido. Debe ser diario, semanal o mensual",
      })
    }

    if (!tipoProduccion || !["leche", "carne"].includes(tipoProduccion)) {
      return res.status(400).json({
        success: false,
        message: "Tipo de producción inválido. Debe ser leche o carne",
      })
    }

    // IMPORTANTE: Obtener IDs de animales que pertenecen al usuario para garantizar Object Level Authorization
    const ganado = await Ganado.findAll({
      where: { usuarioId: req.usuario.id },
      attributes: ["id"],
    })

    const animalIds = ganado.map((animal) => animal.id)

    // Si el usuario no tiene animales, devolver un reporte vacío
    if (animalIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          periodo,
          tipoProduccion,
          reporte: [],
          alerta: "No tiene animales registrados para generar el reporte.",
        },
      })
    }

    // Definir agrupación según el periodo
    let groupByClause
    if (periodo === "diario") {
      groupByClause = "DATE(fechaRegistro)"
    } else if (periodo === "semanal") {
      groupByClause = "YEARWEEK(fechaRegistro, 1)"
    } else if (periodo === "mensual") {
      groupByClause = 'DATE_FORMAT(fechaRegistro, "%Y-%m")'
    }

    // Consulta para generar el reporte
    const reporte = await sequelize.query(
      `
      SELECT 
        ${groupByClause} as periodo,
        SUM(cantidad) as totalProduccion,
        COUNT(DISTINCT animalId) as cantidadAnimales,
        AVG(cantidad) as promedioProduccion
      FROM produccion
      WHERE 
        animalId IN (${animalIds.join(",")}) AND
        tipoProduccion = '${tipoProduccion}'
      GROUP BY ${groupByClause}
      ORDER BY periodo DESC
    `,
      { type: sequelize.QueryTypes.SELECT },
    )

    // Verificar si hay producción en los últimos 7 días
    const fechaActual = new Date()
    const fechaHace7Dias = new Date(fechaActual)
    fechaHace7Dias.setDate(fechaHace7Dias.getDate() - 7)

    const produccionReciente = await Produccion.findOne({
      where: {
        animalId: { [Op.in]: animalIds },
        tipoProduccion,
        fechaRegistro: {
          [Op.between]: [fechaHace7Dias, fechaActual],
        },
      },
    })

    const alerta = !produccionReciente
      ? `¡Alerta! No se ha registrado producción de ${tipoProduccion} en los últimos 7 días.`
      : null

    res.status(200).json({
      success: true,
      data: {
        periodo,
        tipoProduccion,
        reporte,
        alerta,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al generar reporte de producción",
      error: error.message,
    })
  }
}
