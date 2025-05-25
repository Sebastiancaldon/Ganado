const jwt = require("jsonwebtoken")
const { Usuario } = require("../models")

// Registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { nombre, cedula, password } = req.body

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { cedula } })
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un usuario con esta cédula",
      })
    }

    // Crear el nuevo usuario
    const usuario = await Usuario.create({
      nombre,
      cedula,
      password,
    })

    // Generar token JWT
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET || "agrotrack_secret_key", { expiresIn: "24h" })

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        cedula: usuario.cedula,
        token,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
      error: error.message,
    })
  }
}

// Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { cedula, password } = req.body

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ where: { cedula } })
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      })
    }

    // Verificar la contraseña
    const isPasswordValid = await usuario.validPassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      })
    }

    // Generar token JWT
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET || "agrotrack_secret_key", { expiresIn: "24h" })

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        cedula: usuario.cedula,
        token,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión",
      error: error.message,
    })
  }
}

// Obtener perfil del usuario
exports.getProfile = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ["password"] },
    })

    res.status(200).json({
      success: true,
      data: usuario,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener perfil",
      error: error.message,
    })
  }
}
