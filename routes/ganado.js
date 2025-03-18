const express = require("express");
const router = express.Router();
const { Animal } = require("../models"); // Importar el modelo

// Ruta para registrar un nuevo animal
router.post("/", async (req, res) => {
    try {
        console.log("Datos recibidos:", req.body);

        const nuevoAnimal = await Animal.create({
            raza: req.body.raza,
            genero: req.body.genero,
            fechaNacimiento: req.body.fechaNacimiento,
            peso: req.body.peso,
            estadoSalud: req.body.estadoSalud,
            categoria: req.body.categoria
        });

        res.status(201).json(nuevoAnimal);
    } catch (error) {
        console.error("Error al agregar animal:", error);
        res.status(400).json({ error: error.message });
    }
});


// Ruta para obtener todos los animales
router.get("/", async (req, res) => {
    try {
        const animales = await Animal.findAll();
        res.json(animales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para eliminar un animal por ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Intentando eliminar el animal con ID:", id);

        const animal = await Animal.findByPk(id);

        if (!animal) {
            return res.status(404).json({ error: "Animal no encontrado" });
        }

        await animal.destroy();
        res.status(200).json({ message: "Ganado eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar animal:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
