const { sequelize } = require("../models")

// Función para desactivar las restricciones de clave foránea
async function disableForeignKeyChecks() {
  try {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0")
    console.log("Restricciones de clave foránea desactivadas")
    return true
  } catch (error) {
    console.error("Error al desactivar restricciones de clave foránea:", error)
    return false
  }
}

// Función para reactivar las restricciones de clave foránea
async function enableForeignKeyChecks() {
  try {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1")
    console.log("Restricciones de clave foránea reactivadas")
    return true
  } catch (error) {
    console.error("Error al reactivar restricciones de clave foránea:", error)
    return false
  }
}

// Función para cerrar la conexión a la base de datos
async function closeConnection() {
  try {
    await sequelize.close()
    console.log("Conexión a la base de datos cerrada")
    return true
  } catch (error) {
    console.error("Error al cerrar la conexión a la base de datos:", error)
    return false
  }
}

module.exports = {
  disableForeignKeyChecks,
  enableForeignKeyChecks,
  closeConnection,
}
