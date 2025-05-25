/**
 * Middleware para limitar el tamaño del payload de las solicitudes
 * Protege contra ataques de consumo excesivo de recursos (API4:2023)
 */
const payloadLimiter = (req, res, next) => {
  // Verificar si la solicitud tiene un cuerpo
  if (req.body) {
    // Convertir el cuerpo a JSON para medir su tamaño
    const payloadSize = JSON.stringify(req.body).length

    // Límite de 100KB para el tamaño del payload
    const MAX_PAYLOAD_SIZE = 100 * 1024 // 100KB en bytes

    if (payloadSize > MAX_PAYLOAD_SIZE) {
      return res.status(413).json({
        success: false,
        message: "Payload demasiado grande. El tamaño máximo permitido es 100KB.",
      })
    }

    // Verificar la profundidad del objeto para prevenir ataques de JSON anidado
    const MAX_DEPTH = 10
    try {
      const checkDepth = (obj, depth = 0) => {
        if (depth > MAX_DEPTH) {
          throw new Error("Profundidad máxima excedida")
        }

        if (obj && typeof obj === "object") {
          for (const key in obj) {
            checkDepth(obj[key], depth + 1)
          }
        }
      }

      checkDepth(req.body)
    } catch (error) {
      return res.status(413).json({
        success: false,
        message: "Estructura de datos demasiado compleja. La profundidad máxima permitida es 10 niveles.",
      })
    }
  }

  next()
}

module.exports = payloadLimiter
