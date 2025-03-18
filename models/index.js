const { Sequelize } = require("sequelize");
const config = require("../config/config.json")["development"];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Importar modelos
db.Animal = require("./animal")(sequelize, Sequelize.DataTypes);

module.exports = db;
