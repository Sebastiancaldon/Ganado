const request = require("supertest");
const app = require("../app");
const db = require("../models");

describe("API de Ganado", () => {
    let idGanado;

    beforeAll(async () => {
        await db.sequelize.sync();
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    test("Debe agregar un nuevo ganado con más datos", async () => {
        const nuevoGanado = {
            nombre: "Pel",
            raza: "Hambris",
            genero: "Macho",
            fechaNacimiento: "2020-05-10",
            peso: 330,
            estadoSalud: "Bueno",
            categoria: "Toro"
        };

        const response = await request(app).post("/ganado").send(nuevoGanado);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("id");

        idGanado = response.body.id;
        console.log("Nuevo ID registrado:", idGanado);
    });

    test("Debe eliminar un ganado", async () => {
        const response = await request(app).delete(`/ganado/${idGanado}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Ganado eliminado correctamente");
    });
});
