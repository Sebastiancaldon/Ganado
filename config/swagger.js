const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API Sistema Ganadero',
    description: 'Documentación generada automáticamente',
    version: '1.0.0'
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http'],
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Ingresa tu token con formato: Bearer {token}'
    }
  },
  security: [{ Bearer: [] }]
};

const outputFile = './config/swagger.json';
const endpointsFiles = [
  './app.js',
  './routes/auth.js',
  './routes/ganado.js',
  './routes/produccion.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);
