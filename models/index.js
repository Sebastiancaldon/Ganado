'use strict';

const Sequelize = require('sequelize');
const path = require('path');
const config = require(path.join(__dirname, '/../config/config.json'))['development'];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ✅ Cargar modelos
db.Usuario = require('./usuario')(sequelize, Sequelize.DataTypes);
db.Ganado = require('./ganado')(sequelize, Sequelize.DataTypes);
db.Produccion = require('./produccion')(sequelize, Sequelize.DataTypes);

// ✅ Asociaciones personalizadas (¡esto va después!)
db.Ganado.hasMany(db.Produccion, { foreignKey: 'ganado_id' });
db.Produccion.belongsTo(db.Ganado, { foreignKey: 'ganado_id' });

// ✅ Asociaciones automáticas (si usas .associate dentro de cada modelo)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
