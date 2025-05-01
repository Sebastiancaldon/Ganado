const express = require('express');
const app = express();
const db = require('./models');
require('dotenv').config();

// Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');

// Middleware
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const ganadoRoutes = require('./routes/ganado');
app.use('/ganado', ganadoRoutes);

const produccionRoutes = require('./routes/produccion');
app.use('/produccion', produccionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🐄 Servidor funcionando');
});

// Ruta para documentación Swagger
app.use('/document', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Base de datos
db.sequelize.sync({ alter: true })
  .then(() => console.log("✅ Base de datos sincronizada"))
  .catch(err => console.error("❌ Error de DB:", err));

module.exports = app; // 👈 IMPORTANTE si usas bin/www
