const axios = require('axios');

async function testGanado() {
    try {
        // 1️⃣ Agregar un nuevo animal
        const response = await axios.post('http://localhost:3000/ganado', {
            raza: "Hambris",
            genero: "Macho",
            fechaNacimiento: "2020-05-10",
            peso: 330,
            estadoSalud: "Bueno",
            categoria: "Toro"
        });

        const id = response.data.id;
        console.log(`✅ Animal agregado con ID: ${id}`);

        // 2️⃣ Eliminar el animal por ID
        await axios.delete(`http://localhost:3000/ganado/${id}`);
        console.log(`❌ Animal con ID ${id} eliminado`);

    } catch (error) {
        console.error("❌ Error:", error.response ? error.response.data : error.message);
    }
}

testGanado();
