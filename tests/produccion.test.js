const request = require("supertest")
const app = require("../app")
const { Usuario, Ganado, Produccion } = require("../models")
const { disableForeignKeyChecks, enableForeignKeyChecks, closeConnection } = require("./setup")

// Hooks de Jest definidos a nivel superior
beforeAll(async () => {
  await disableForeignKeyChecks()
})

afterAll(async () => {
  await enableForeignKeyChecks()
  await closeConnection()
})

describe("Pruebas de gestión de producción", () => {
  let token
  let usuarioId
  let ganadoId

  // Configurar un usuario y un animal antes de las pruebas
  beforeAll(async () => {
    // Limpiar tablas en orden inverso a las dependencias
    await Produccion.destroy({ where: {} })
    await Ganado.destroy({ where: {} })
    await Usuario.destroy({ where: {} })

    // Crear un usuario para las pruebas
    const userData = {
      nombre: "Usuario Test",
      cedula: "1234567890",
      password: "password123",
    }

    const userResponse = await request(app).post("/api/auth/register").send(userData)

    token = userResponse.body.data.token
    usuarioId = userResponse.body.data.id

    // Crear un animal para las pruebas
    const ganadoData = {
      identificacion: "G001",
      raza: "Holstein",
      fechaNacimiento: "2020-01-01",
      sexo: "Hembra",
      peso: 450.5,
    }

    const ganadoResponse = await request(app)
      .post("/api/ganado")
      .set("Authorization", `Bearer ${token}`)
      .send(ganadoData)

    ganadoId = ganadoResponse.body.data.id
  })

  // Limpiar la tabla de producción antes de cada prueba
  beforeEach(async () => {
    await Produccion.destroy({ where: {} })
  })

  describe("POST /api/produccion", () => {
    it("debería crear un nuevo registro de producción", async () => {
      const produccionData = {
        animalId: ganadoId,
        tipoProduccion: "leche",
        cantidad: 25.5,
        fechaRegistro: "2023-05-20",
      }

      const response = await request(app)
        .post("/api/produccion")
        .set("Authorization", `Bearer ${token}`)
        .send(produccionData)

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty("animalId", ganadoId)
      expect(response.body.data).toHaveProperty("tipoProduccion", produccionData.tipoProduccion)
      expect(response.body.data).toHaveProperty("cantidad", produccionData.cantidad)
    })

    it("debería rechazar la creación con un animalId inexistente", async () => {
      const produccionData = {
        animalId: 9999,
        tipoProduccion: "leche",
        cantidad: 25.5,
      }

      const response = await request(app)
        .post("/api/produccion")
        .set("Authorization", `Bearer ${token}`)
        .send(produccionData)

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
    })
  })

  describe("GET /api/produccion", () => {
    it("debería obtener todos los registros de producción", async () => {
      // Crear algunos registros de producción
      const produccion1 = {
        animalId: ganadoId,
        tipoProduccion: "leche",
        cantidad: 25.5,
        fechaRegistro: "2023-05-20",
      }

      const produccion2 = {
        animalId: ganadoId,
        tipoProduccion: "leche",
        cantidad: 27.8,
        fechaRegistro: "2023-05-21",
      }

      await request(app).post("/api/produccion").set("Authorization", `Bearer ${token}`).send(produccion1)

      await request(app).post("/api/produccion").set("Authorization", `Bearer ${token}`).send(produccion2)

      // Obtener todos los registros
      const response = await request(app).get("/api/produccion").set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.count).toBe(2)
      expect(response.body.data[0]).toHaveProperty("animalId", ganadoId)
      expect(response.body.data[1]).toHaveProperty("animalId", ganadoId)
    })

    it("debería filtrar registros por tipo de producción", async () => {
      // Crear algunos registros de producción
      const produccion1 = {
        animalId: ganadoId,
        tipoProduccion: "leche",
        cantidad: 25.5,
        fechaRegistro: "2023-05-20",
      }

      const produccion2 = {
        animalId: ganadoId,
        tipoProduccion: "carne",
        cantidad: 120,
        fechaRegistro: "2023-05-21",
      }

      await request(app).post("/api/produccion").set("Authorization", `Bearer ${token}`).send(produccion1)

      await request(app).post("/api/produccion").set("Authorization", `Bearer ${token}`).send(produccion2)

      // Filtrar por tipo de producción
      const response = await request(app)
        .get("/api/produccion?tipoProduccion=leche")
        .set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.count).toBe(1)
      expect(response.body.data[0]).toHaveProperty("tipoProduccion", "leche")
    })
  })

  describe("GET /api/produccion/:id", () => {
    it("debería obtener un registro de producción por ID", async () => {
      // Crear un registro de producción
      const produccionData = {
        animalId: ganadoId,
        tipoProduccion: "leche",
        cantidad: 25.5,
        fechaRegistro: "2023-05-20",
      }

      const createResponse = await request(app)
        .post("/api/produccion")
        .set("Authorization", `Bearer ${token}`)
        .send(produccionData)

      const produccionId = createResponse.body.data.id

      // Obtener el registro por ID
      const response = await request(app).get(`/api/produccion/${produccionId}`).set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty("id", produccionId)
      expect(response.body.data).toHaveProperty("animalId", ganadoId)
      expect(response.body.data).toHaveProperty("tipoProduccion", produccionData.tipoProduccion)
    })
  })

  describe("PUT /api/produccion/:id", () => {
    it("debería actualizar un registro de producción", async () => {
      // Crear un registro de producción
      const produccionData = {
        animalId: ganadoId,
        tipoProduccion: "leche",
        cantidad: 25.5,
        fechaRegistro: "2023-05-20",
      }

      const createResponse = await request(app)
        .post("/api/produccion")
        .set("Authorization", `Bearer ${token}`)
        .send(produccionData)

      const produccionId = createResponse.body.data.id

      // Datos para actualizar
      const updateData = {
        cantidad: 30.2,
      }

      // Actualizar el registro
      const response = await request(app)
        .put(`/api/produccion/${produccionId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty("cantidad", updateData.cantidad)
      expect(response.body.data).toHaveProperty("tipoProduccion", produccionData.tipoProduccion)
    })
  })

  describe("DELETE /api/produccion/:id", () => {
    it("debería eliminar un registro de producción", async () => {
      // Crear un registro de producción
      const produccionData = {
        animalId: ganadoId,
        tipoProduccion: "leche",
        cantidad: 25.5,
        fechaRegistro: "2023-05-20",
      }

      const createResponse = await request(app)
        .post("/api/produccion")
        .set("Authorization", `Bearer ${token}`)
        .send(produccionData)

      const produccionId = createResponse.body.data.id

      // Eliminar el registro
      const response = await request(app)
        .delete(`/api/produccion/${produccionId}`)
        .set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)

      // Verificar que el registro ya no existe
      const getResponse = await request(app)
        .get(`/api/produccion/${produccionId}`)
        .set("Authorization", `Bearer ${token}`)

      expect(getResponse.status).toBe(404)
    })
  })

  describe("GET /api/produccion/reporte", () => {
    it("debería generar un reporte de producción", async () => {
      // Crear algunos registros de producción
      const produccion1 = {
        animalId: ganadoId,
        tipoProduccion: "leche",
        cantidad: 25.5,
        fechaRegistro: "2023-05-20",
      }

      const produccion2 = {
        animalId: ganadoId,
        tipoProduccion: "leche",
        cantidad: 27.8,
        fechaRegistro: "2023-05-21",
      }

      await request(app).post("/api/produccion").set("Authorization", `Bearer ${token}`).send(produccion1)

      await request(app).post("/api/produccion").set("Authorization", `Bearer ${token}`).send(produccion2)

      // Generar reporte
      const response = await request(app)
        .get("/api/produccion/reporte")
        .query({ periodo: "diario", tipoProduccion: "leche" })
        .set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty("periodo", "diario")
      expect(response.body.data).toHaveProperty("tipoProduccion", "leche")
      expect(response.body.data).toHaveProperty("reporte")
      expect(Array.isArray(response.body.data.reporte)).toBe(true)
    })

    it("debería rechazar la generación de reporte con parámetros inválidos", async () => {
      const response = await request(app)
        .get("/api/produccion/reporte")
        .query({ periodo: "invalido", tipoProduccion: "leche" })
        .set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })
})
