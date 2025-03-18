const request = require('supertest');
const app = require('../app'); // Asegúrate de que este es tu servidor Express

describe('API de Ganado - Agregar', () => {
  test('Debe agregar un nuevo ganado', async () => {
    const response = await request(app).post('/ganado').send({
      raza: 'Hambris',
      genero: 'Macho',
      fechaNacimiento: '2020-05-10',
      peso: 330,
      estadoSalud: 'Bueno',
      categoria: 'Toro'
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    console.log(`Nuevo ID registrado: ${response.body.id}`);
  });

  
});
