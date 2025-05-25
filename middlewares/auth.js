const jwt = require("jsonwebtoken")
const { Usuario } = require("../models")

module.exports = async (req, res, next) => {
  try {
    // Verificar si existe el token en los headers
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Acceso denegado. No se proporcionó token de autenticación",
      })
    }

    // Extraer el token
    const token = authHeader.split(" ")[1]

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "agrotrack_secret_key")

    // Buscar el usuario
    const usuario = await Usuario.findByPk(decoded.id)
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    // Agregar el usuario al objeto request
    req.usuario = usuario
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token inválido",
      error: error.message,
    })
  }
}
