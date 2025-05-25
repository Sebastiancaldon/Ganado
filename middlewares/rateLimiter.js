const rateLimit = require("express-rate-limit")
const { Usuario } = require("../models")

// Configuración básica del rate limiter
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs, // Ventana de tiempo en milisegundos
    max, // Número máximo de solicitudes en la ventana de tiempo
    message: {
      success: false,
      message,
    },
    // Función para generar la clave del limitador (basada en IP + ID de usuario si está autenticado)
    keyGenerator: (req) => {
      return req.usuario ? `${req.ip}-${req.usuario.id}` : req.ip
    },
    // Función para manejar cuando se excede el límite
    handler: (req, res, next) => {
      res.status(429).json({
        success: false,
        message: "Demasiadas solicitudes, por favor intente más tarde.",
        retryAfter: Math.ceil(windowMs / 1000 / 60), // Tiempo en minutos para reintentar
      })
    },
    // Encabezados estándar para rate limiting
    standardHeaders: true,
    // Habilitar encabezados de información de límite
    legacyHeaders: false,
  })
}

// Rate limiter para rutas de autenticación (más permisivo)
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutos
  30, // 30 solicitudes por ventana
  "Demasiados intentos de autenticación, por favor intente más tarde.",
)

// Rate limiter para rutas generales (moderado)
const apiLimiter = createRateLimiter(
  5 * 60 * 1000, // 5 minutos
  100, // 100 solicitudes por ventana
  "Demasiadas solicitudes a la API, por favor intente más tarde.",
)

// Rate limiter para rutas sensibles (más restrictivo)
const sensitiveLimiter = createRateLimiter(
  10 * 60 * 1000, // 10 minutos
  50, // 50 solicitudes por ventana
  "Demasiadas solicitudes a recursos sensibles, por favor intente más tarde.",
)

module.exports = {
  authLimiter,
  apiLimiter,
  sensitiveLimiter,
}
