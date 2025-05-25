const express = require("express")
const cors = require("cors")
const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("./swagger.json")
const { sequelize } = require("./models")
const authRoutes = require("./routes/auth")
const ganadoRoutes = require("./routes/ganado")
const produccionRoutes = require("./routes/produccion")
const { authLimiter, apiLimiter, sensitiveLimiter } = require("./middlewares/rateLimiter")
const payloadLimiter = require("./middlewares/payloadLimiter")
const helmet = require("helmet")

const app = express()

// Middlewares de seguridad
app.use(helmet()) // Protección de encabezados HTTP
app.use(cors())
app.use(express.json({ limit: "100kb" })) // Limitar tamaño de payload a nivel de express
app.use(payloadLimiter) // Middleware personalizado para validación adicional de payload

// Rutas con rate limiting
app.use("/api/auth", authLimiter, authRoutes)
app.use("/api/ganado", apiLimiter, ganadoRoutes)
app.use("/api/produccion", sensitiveLimiter, produccionRoutes)

// Documentación Swagger
app.use("/api-docs", apiLimiter, swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API AgroTrack funcionando correctamente" })
})

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Error en el servidor",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  })
})

module.exports = app
