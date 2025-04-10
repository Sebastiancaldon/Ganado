const express = require('express');
const app = express();
const db = require('./models');
require('dotenv').config();


// Middleware para leer JSON
app.use(express.json());

// 🔌 MONTAR rutas
const authRoutes = require('./routes/auth'); // 👈 importa rutas
app.use('/auth', authRoutes);                // 👈 activa /auth/register

const ganadoRoutes = require('./routes/ganado');
app.use('/ganado', ganadoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🐄 Servidor funcionando');
});

// Base de datos
db.sequelize.sync({ alter: true })

  .then(() => console.log("✅ Base de datos sincronizada"))
  .catch(err => console.error("❌ Error de DB:", err));



const produccionRoutes = require('./routes/produccion');
app.use('/produccion', produccionRoutes);

module.exports = app; // 👈 IMPORTANTE si usas bin/www