// swaggerConfig.js
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Library API',
    version: '1.0.0',
    description: 'A simple Express Library API',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/**/*.js'], // Lokasi file dengan anotasi Swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
