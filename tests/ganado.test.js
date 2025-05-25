const request = require("supertest")
const app = require("../app")
const { Usuario, Ganado } = require("../models")
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

describe("Pruebas de gestión de ganado", () => {
  let token
  let usuarioId

  // Configurar un usuario y obtener token antes de las pruebas
  beforeAll(async () => {
    // Limpiar tablas en orden inverso a las dependencias
    await Ganado.destroy({ where: {} })
    await Usuario.destroy({ where: {} })

    // Crear un usuario para las pruebas
    const userData = {
      nombre: "Usuario Test",
      cedula: "1234567890",
      password: "password123",
    }

    const response = await request(app).post("/api/auth/register").send(userData)

    token = response.body.data.token
    usuarioId = response.body.data.id
  })

  // Limpiar la tabla de ganado antes de cada prueba
  beforeEach(async () => {
    await Ganado.destroy({ where: {} })
  })

  describe("POST /api/ganado", () => {
    it("debería crear un nuevo registro de ganado", async () => {
      const ganadoData = {
        identificacion: "G001",
        raza: "Holstein",
        fechaNacimiento: "2020-01-01",
        sexo: "Hembra",
        peso: 450.5,
      }

      const response = await request(app).post("/api/ganado").set("Authorization", `Bearer ${token}`).send(ganadoData)

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty("identificacion", ganadoData.identificacion)
      expect(response.body.data).toHaveProperty("raza", ganadoData.raza)
      expect(response.body.data).toHaveProperty("usuarioId", usuarioId)
    })

    it("debería rechazar la creación con identificación duplicada", async () => {
      const ganadoData = {
        identificacion: "G001",
        raza: "Holstein",
        fechaNacimiento: "2020-01-01",
        sexo: "Hembra",
        peso: 450.5,
      }

      // Crear el primer registro
      await request(app).post("/api/ganado").set("Authorization", `Bearer ${token}`).send(ganadoData)

      // Intentar crear un segundo registro con la misma identificación
      const response = await request(app).post("/api/ganado").set("Authorization", `Bearer ${token}`).send(ganadoData)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("Ya existe un animal con esta identificación")
    })
  })

  describe("GET /api/ganado", () => {
    it("debería obtener todos los registros de ganado del usuario", async () => {
      // Crear algunos registros de ganado
      const ganado1 = {
        identificacion: "G001",
        raza: "Holstein",
        fechaNacimiento: "2020-01-01",
        sexo: "Hembra",
        peso: 450.5,
      }

      const ganado2 = {
        identificacion: "G002",
        raza: "Jersey",
        fechaNacimiento: "2019-05-15",
        sexo: "Macho",
        peso: 520.3,
      }

      await request(app).post("/api/ganado").set("Authorization", `Bearer ${token}`).send(ganado1)

      await request(app).post("/api/ganado").set("Authorization", `Bearer ${token}`).send(ganado2)

      // Obtener todos los registros
      const response = await request(app).get("/api/ganado").set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.count).toBe(2)
      expect(response.body.data[0]).toHaveProperty("identificacion")
      expect(response.body.data[1]).toHaveProperty("identificacion")
    })

    it("debería filtrar registros por raza", async () => {
      // Crear algunos registros de ganado
      const ganado1 = {
        identificacion: "G001",
        raza: "Holstein",
        fechaNacimiento: "2020-01-01",
        sexo: "Hembra",
        peso: 450.5,
      }

      const ganado2 = {
        identificacion: "G002",
        raza: "Jersey",
        fechaNacimiento: "2019-05-15",
        sexo: "Macho",
        peso: 520.3,
      }

      await request(app).post("/api/ganado").set("Authorization", `Bearer ${token}`).send(ganado1)

      await request(app).post("/api/ganado").set("Authorization", `Bearer ${token}`).send(ganado2)

      // Filtrar por raza
      const response = await request(app).get("/api/ganado?raza=Holstein").set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.count).toBe(1)
      expect(response.body.data[0]).toHaveProperty("raza", "Holstein")
    })
  })

  describe("GET /api/ganado/:id", () => {
    it("debería obtener un registro de ganado por ID", async () => {
      // Crear un registro de ganado
      const ganadoData = {
        identificacion: "G001",
        raza: "Holstein",
        fechaNacimiento: "2020-01-01",
        sexo: "Hembra",
        peso: 450.5,
      }

      const createResponse = await request(app)
        .post("/api/ganado")
        .set("Authorization", `Bearer ${token}`)
        .send(ganadoData)

      const ganadoId = createResponse.body.data.id

      // Obtener el registro por ID
      const response = await request(app).get(`/api/ganado/${ganadoId}`).set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty("id", ganadoId)
      expect(response.body.data).toHaveProperty("identificacion", ganadoData.identificacion)
    })

    it("debería devolver 404 para un ID inexistente", async () => {
      const response = await request(app).get("/api/ganado/9999").set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
    })
  })

  describe("PUT /api/ganado/:id", () => {
    it("debería actualizar un registro de ganado", async () => {
      // Crear un registro de ganado
      const ganadoData = {
        identificacion: "G001",
        raza: "Holstein",
        fechaNacimiento: "2020-01-01",
        sexo: "Hembra",
        peso: 450.5,
      }

      const createResponse = await request(app)
        .post("/api/ganado")
        .set("Authorization", `Bearer ${token}`)
        .send(ganadoData)

      const ganadoId = createResponse.body.data.id

      // Datos para actualizar
      const updateData = {
        raza: "Jersey",
        peso: 480.2,
      }

      // Actualizar el registro
      const response = await request(app)
        .put(`/api/ganado/${ganadoId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty("raza", updateData.raza)
      expect(response.body.data).toHaveProperty("peso", updateData.peso)
      expect(response.body.data).toHaveProperty("identificacion", ganadoData.identificacion)
    })
  })

  describe("DELETE /api/ganado/:id", () => {
    it("debería eliminar un registro de ganado", async () => {
      // Crear un registro de ganado
      const ganadoData = {
        identificacion: "G001",
        raza: "Holstein",
        fechaNacimiento: "2020-01-01",
        sexo: "Hembra",
        peso: 450.5,
      }

      const createResponse = await request(app)
        .post("/api/ganado")
        .set("Authorization", `Bearer ${token}`)
        .send(ganadoData)

      const ganadoId = createResponse.body.data.id

      // Eliminar el registro
      const response = await request(app).delete(`/api/ganado/${ganadoId}`).set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)

      // Verificar que el registro ya no existe
      const getResponse = await request(app).get(`/api/ganado/${ganadoId}`).set("Authorization", `Bearer ${token}`)

      expect(getResponse.status).toBe(404)
    })
  })
})
