const request = require("supertest")
const app = require("../app")
const { Usuario } = require("../models")
const jwt = require("jsonwebtoken")
const { disableForeignKeyChecks, enableForeignKeyChecks, closeConnection } = require("./setup")

// Hooks de Jest definidos a nivel superior
beforeAll(async () => {
  await disableForeignKeyChecks()
})

afterAll(async () => {
  await enableForeignKeyChecks()
  await closeConnection()
})

describe("Pruebas de autenticación", () => {
  // Limpiar la base de datos antes de cada prueba
  beforeEach(async () => {
    await Usuario.destroy({ where: {} })
  })

  describe("POST /api/auth/register", () => {
    it("debería registrar un nuevo usuario", async () => {
      const userData = {
        nombre: "Usuario Test",
        cedula: "1234567890",
        password: "password123",
      }

      const response = await request(app).post("/api/auth/register").send(userData)

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty("token")
      expect(response.body.data.nombre).toBe(userData.nombre)
      expect(response.body.data.cedula).toBe(userData.cedula)
    })

    it("debería rechazar el registro con cédula duplicada", async () => {
      const userData = {
        nombre: "Usuario Test",
        cedula: "1234567890",
        password: "password123",
      }

      // Crear el primer usuario
      await request(app).post("/api/auth/register").send(userData)

      // Intentar crear un segundo usuario con la misma cédula
      const response = await request(app).post("/api/auth/register").send(userData)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("Ya existe un usuario con esta cédula")
    })
  })

  describe("POST /api/auth/login", () => {
    it("debería iniciar sesión con credenciales válidas", async () => {
      // Registrar un usuario primero
      const userData = {
        nombre: "Usuario Test",
        cedula: "1234567890",
        password: "password123",
      }

      await request(app).post("/api/auth/register").send(userData)

      // Intentar iniciar sesión
      const loginData = {
        cedula: "1234567890",
        password: "password123",
      }

      const response = await request(app).post("/api/auth/login").send(loginData)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty("token")
      expect(response.body.data.nombre).toBe(userData.nombre)
      expect(response.body.data.cedula).toBe(userData.cedula)
    })

    it("debería rechazar el inicio de sesión con credenciales inválidas", async () => {
      // Registrar un usuario primero
      const userData = {
        nombre: "Usuario Test",
        cedula: "1234567890",
        password: "password123",
      }

      await request(app).post("/api/auth/register").send(userData)

      // Intentar iniciar sesión con contraseña incorrecta
      const loginData = {
        cedula: "1234567890",
        password: "contraseñaIncorrecta",
      }

      const response = await request(app).post("/api/auth/login").send(loginData)

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("Credenciales inválidas")
    })
  })

  describe("GET /api/auth/profile", () => {
    it("debería obtener el perfil del usuario autenticado", async () => {
      // Registrar un usuario primero
      const userData = {
        nombre: "Usuario Test",
        cedula: "1234567890",
        password: "password123",
      }

      const registerResponse = await request(app).post("/api/auth/register").send(userData)

      const token = registerResponse.body.data.token

      // Obtener el perfil con el token
      const response = await request(app).get("/api/auth/profile").set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty("nombre", userData.nombre)
      expect(response.body.data).toHaveProperty("cedula", userData.cedula)
      expect(response.body.data).not.toHaveProperty("password")
    })

    it("debería rechazar el acceso sin token", async () => {
      const response = await request(app).get("/api/auth/profile")

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })
})
