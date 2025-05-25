require("dotenv").config()
const app = require("./app")
const { sequelize } = require("./models")

const PORT = process.env.PORT || 3000

async function assertDatabaseConnectionOk() {
  console.log("Verificando conexión a la base de datos...")
  try {
    await sequelize.authenticate()
    console.log("Conexión a la base de datos establecida correctamente.")
  } catch (error) {
    console.log("No se pudo conectar a la base de datos:")
    console.log(error.message)
    process.exit(1)
  }
}

async function init() {
  await assertDatabaseConnectionOk()

  console.log(`Iniciando servidor en el puerto ${PORT}...`)
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
    console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`)
  })
}

init()
