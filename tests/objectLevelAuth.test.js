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

describe("Pruebas de autorización a nivel de objeto (BOLA)", () => {
  let token1, token2
  let usuario1Id, usuario2Id
  let ganado1Id, ganado2Id
  let produccion1Id, produccion2Id

  // Configurar dos usuarios y sus recursos antes de las pruebas
  beforeAll(async () => {
    // Limpiar tablas en orden inverso a las dependencias
    await Produccion.destroy({ where: {} })
    await Ganado.destroy({ where: {} })
    await Usuario.destroy({ where: {} })

    // Crear el primer usuario
    const userData1 = {
      nombre: "Usuario Test 1",
      cedula: "1111111111",
      password: "password123",
    }

    const response1 = await request(app).post("/api/auth/register").send(userData1)
    token1 = response1.body.data.token
    usuario1Id = response1.body.data.id

    // Crear el segundo usuario
    const userData2 = {
      nombre: "Usuario Test 2",
      cedula: "2222222222",
      password: "password123",
    }

    const response2 = await request(app).post("/api/auth/register").send(userData2)
    token2 = response2.body.data.token
    usuario2Id = response2.body.data.id

    // Crear ganado para el primer usuario
    const ganado1 = {
      identificacion: "G001-U1",
      raza: "Holstein",
      fechaNacimiento: "2020-01-01",
      sexo: "Hembra",
      peso: 450.5,
    }

    const ganadoResponse1 = await request(app)
      .post("/api/ganado")
      .set("Authorization", `Bearer ${token1}`)
      .send(ganado1)

    ganado1Id = ganadoResponse1.body.data.id

    // Crear ganado para el segundo usuario
    const ganado2 = {
      identificacion: "G001-U2",
      raza: "Jersey",
      fechaNacimiento: "2019-05-15",
      sexo: "Macho",
      peso: 520.3,
    }

    const ganadoResponse2 = await request(app)
      .post("/api/ganado")
      .set("Authorization", `Bearer ${token2}`)
      .send(ganado2)

    ganado2Id = ganadoResponse2.body.data.id

    // Crear producción para el primer usuario
    const produccion1 = {
      animalId: ganado1Id,
      tipoProduccion: "leche",
      cantidad: 25.5,
      fechaRegistro: "2023-05-20",
    }

    const produccionResponse1 = await request(app)
      .post("/api/produccion")
      .set("Authorization", `Bearer ${token1}`)
      .send(produccion1)

    produccion1Id = produccionResponse1.body.data.id

    // Crear producción para el segundo usuario
    const produccion2 = {
      animalId: ganado2Id,
      tipoProduccion: "leche",
      cantidad: 30.2,
      fechaRegistro: "2023-05-20",
    }

    const produccionResponse2 = await request(app)
      .post("/api/produccion")
      .set("Authorization", `Bearer ${token2}`)
      .send(produccion2)

    produccion2Id = produccionResponse2.body.data.id
  })

  describe("Protección de acceso a ganado", () => {
    it("debería permitir acceso a ganado propio", async () => {
      const response = await request(app).get(`/api/ganado/${ganado1Id}`).set("Authorization", `Bearer ${token1}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty("id", ganado1Id)
    })

    it("debería denegar acceso a ganado de otro usuario", async () => {
      const response = await request(app).get(`/api/ganado/${ganado1Id}`).set("Authorization", `Bearer ${token2}`)

      expect(response.status).toBe(403)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("No tiene autorización")
    })

    it("debería denegar actualización de ganado de otro usuario", async () => {
      const updateData = {
        peso: 480.2,
      }

      const response = await request(app)
        .put(`/api/ganado/${ganado1Id}`)
        .set("Authorization", `Bearer ${token2}`)
        .send(updateData)

      expect(response.status).toBe(403)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("No tiene autorización")
    })

    it("debería denegar eliminación de ganado de otro usuario", async () => {
      const response = await request(app).delete(`/api/ganado/${ganado1Id}`).set("Authorization", `Bearer ${token2}`)

      expect(response.status).toBe(403)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("No tiene autorización")
    })
  })

  describe("Protección de acceso a producción", () => {
    it("debería permitir acceso a producción propia", async () => {
      const response = await request(app)
        .get(`/api/produccion/${produccion1Id}`)
        .set("Authorization", `Bearer ${token1}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty("id", produccion1Id)
    })

    it("debería denegar acceso a producción de otro usuario", async () => {
      const response = await request(app)
        .get(`/api/produccion/${produccion1Id}`)
        .set("Authorization", `Bearer ${token2}`)

      expect(response.status).toBe(403)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("No tiene autorización")
    })

    it("debería denegar actualización de producción de otro usuario", async () => {
      const updateData = {
        cantidad: 35.8,
      }

      const response = await request(app)
        .put(`/api/produccion/${produccion1Id}`)
        .set("Authorization", `Bearer ${token2}`)
        .send(updateData)

      expect(response.status).toBe(403)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("No tiene autorización")
    })

    it("debería denegar eliminación de producción de otro usuario", async () => {
      const response = await request(app)
        .delete(`/api/produccion/${produccion1Id}`)
        .set("Authorization", `Bearer ${token2}`)

      expect(response.status).toBe(403)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("No tiene autorización")
    })
  })

  describe("Protección al crear producción", () => {
    it("debería denegar crear producción para animal de otro usuario", async () => {
      const produccionData = {
        animalId: ganado1Id, // Animal del usuario 1
        tipoProduccion: "leche",
        cantidad: 28.3,
        fechaRegistro: "2023-05-21",
      }

      const response = await request(app)
        .post("/api/produccion")
        .set("Authorization", `Bearer ${token2}`) // Usuario 2 intentando crear producción
        .send(produccionData)

      expect(response.status).toBe(403)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("No tiene autorización para usar este animal")
    })
  })

  describe("Filtrado en consultas masivas", () => {
    it("getAllGanado debería mostrar solo ganado del usuario autenticado", async () => {
      // Crear ganado adicional para ambos usuarios
      await request(app).post("/api/ganado").set("Authorization", `Bearer ${token1}`).send({
        identificacion: "G002-U1",
        raza: "Holstein",
        fechaNacimiento: "2020-02-01",
        sexo: "Macho",
        peso: 500,
      })

      await request(app).post("/api/ganado").set("Authorization", `Bearer ${token2}`).send({
        identificacion: "G002-U2",
        raza: "Jersey",
        fechaNacimiento: "2019-06-15",
        sexo: "Hembra",
        peso: 480,
      })

      // Obtener ganado del usuario 1
      const response1 = await request(app).get("/api/ganado").set("Authorization", `Bearer ${token1}`)

      expect(response1.status).toBe(200)
      expect(response1.body.success).toBe(true)
      // Debería tener 2 registros (los del usuario 1)
      expect(response1.body.count).toBe(2)
      // Todos los registros deben pertenecer al usuario 1
      response1.body.data.forEach((ganado) => {
        expect(ganado.usuarioId).toBe(usuario1Id)
      })

      // Obtener ganado del usuario 2
      const response2 = await request(app).get("/api/ganado").set("Authorization", `Bearer ${token2}`)

      expect(response2.status).toBe(200)
      expect(response2.body.success).toBe(true)
      // Debería tener 2 registros (los del usuario 2)
      expect(response2.body.count).toBe(2)
      // Todos los registros deben pertenecer al usuario 2
      response2.body.data.forEach((ganado) => {
        expect(ganado.usuarioId).toBe(usuario2Id)
      })
    })

    it("getAllProduccion debería mostrar solo producción de animales del usuario autenticado", async () => {
      // Obtener producción del usuario 1
      const response1 = await request(app).get("/api/produccion").set("Authorization", `Bearer ${token1}`)

      expect(response1.status).toBe(200)
      expect(response1.body.success).toBe(true)
      // Verificar que hay datos en la respuesta
      expect(response1.body.data.length).toBeGreaterThan(0)

      // Todos los registros deben tener animalId que pertenece al usuario 1
      response1.body.data.forEach((produccion) => {
        expect(produccion.animal).toBeDefined()
        expect(produccion.animal.usuarioId).toBe(usuario1Id)
      })

      // Obtener producción del usuario 2
      const response2 = await request(app).get("/api/produccion").set("Authorization", `Bearer ${token2}`)

      expect(response2.status).toBe(200)
      expect(response2.body.success).toBe(true)
      // Verificar que hay datos en la respuesta
      expect(response2.body.data.length).toBeGreaterThan(0)

      // Todos los registros deben tener animalId que pertenece al usuario 2
      response2.body.data.forEach((produccion) => {
        expect(produccion.animal).toBeDefined()
        expect(produccion.animal.usuarioId).toBe(usuario2Id)
      })
    })
  })
})
