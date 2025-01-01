const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Ishchi Top API',
    version: '1.0.0',
    description: 'Ishchi Top Node js Express API',
  },
  servers: [
    {
      url: 'https://ish-chi-top.onrender.com',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;