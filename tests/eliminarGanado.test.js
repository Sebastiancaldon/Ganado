const request = require('supertest');
const app = require('../app');

describe('API de Ganado - Eliminar', () => {
  test('Debe eliminar un ganado', async () => {
    const idAEliminar = 15; // Reemplaza con un ID válido

    const response = await request(app).delete(`/ganado/${idAEliminar}`);
    expect(response.status).toBe(200);
    console.log(`Ganado eliminado con ID: ${idAEliminar}`);
  });
});
