const { Produccion, Ganado } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  async registrarProduccion(req, res) {
    try {
      const { ganado_id, tipoProduccion, cantidad, fechaRegistro } = req.body;

      if (!['leche', 'carne'].includes(tipoProduccion)) {
        return res.status(400).json({ mensaje: 'Tipo de producción inválido' });
      }

      if (!ganado_id || cantidad <= 0 || !fechaRegistro) {
        return res.status(400).json({ mensaje: 'Datos incompletos o inválidos' });
      }

      const animal = await Ganado.findByPk(ganado_id);
      if (!animal) {
        return res.status(404).json({ mensaje: 'Animal no encontrado' });
      }

      const produccion = await Produccion.create({
        ganado_id,
        tipoProduccion,
        cantidad,
        fechaRegistro
      });

      res.status(201).json({ mensaje: 'Producción registrada', produccion });
    } catch (err) {
      console.error('❌ Error completo al registrar producción:\n', err);
      res.status(500).json({ error: err.message });
    }
  },

  async listarProduccion(req, res) {
    try {
      const { tipoProduccion } = req.query;
      const usuarioId = req.user.id;

      const where = {};
      if (tipoProduccion) where.tipoProduccion = tipoProduccion;

      const producciones = await Produccion.findAll({
        where,
        include: {
          model: Ganado,
          attributes: ['raza', 'categoria'],
          where: { usuario_id: usuarioId }
        },
        order: [['fechaRegistro', 'DESC']]
      });

      res.json(producciones);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async actualizarProduccion(req, res) {
    try {
      const { id } = req.params;
      const { cantidad, fechaRegistro } = req.body;

      const produccion = await Produccion.findByPk(id);
      if (!produccion) {
        return res.status(404).json({ mensaje: 'Producción no encontrada' });
      }

      produccion.cantidad = cantidad || produccion.cantidad;
      produccion.fechaRegistro = fechaRegistro || produccion.fechaRegistro;

      await produccion.save();

      res.json({ mensaje: 'Producción actualizada', produccion });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async eliminarProduccion(req, res) {
    try {
      const { id } = req.params;
      const produccion = await Produccion.findByPk(id);

      if (!produccion) {
        return res.status(404).json({ mensaje: 'Producción no encontrada' });
      }

      await produccion.destroy();

      res.json({ mensaje: 'Producción eliminada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async reportePorPeriodo(req, res) {
    try {
      const { periodo } = req.query;
      const ahora = new Date();
      let desde;

      if (periodo === 'diario') {
        desde = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
      } else if (periodo === 'semanal') {
        desde = new Date();
        desde.setDate(ahora.getDate() - 7);
      } else if (periodo === 'mensual') {
        desde = new Date();
        desde.setMonth(ahora.getMonth() - 1);
      } else {
        return res.status(400).json({ mensaje: 'Periodo inválido (diario, semanal, mensual)' });
      }

      const datos = await Produccion.findAll({
        where: { fechaRegistro: { [Op.gte]: desde } },
        include: {
          model: Ganado,
          attributes: ['id', 'raza', 'categoria']
        }
      });

      const resumen = {};
      datos.forEach(p => {
        const key = `${p.ganado_id}-${p.tipoProduccion}`;
        if (!resumen[key]) {
          resumen[key] = {
            animal: p.Ganado,
            tipo: p.tipoProduccion,
            total: 0
          };
        }
        resumen[key].total += p.cantidad;
      });

      res.json(Object.values(resumen));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
