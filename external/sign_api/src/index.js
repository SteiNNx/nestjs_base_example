// src/index.js

/**
 * Punto de entrada principal de la aplicación.
 * Configura el servidor Express y registra las rutas principales.
 *
 * @module index
 */

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const routes = require('./routes/routes');
const LoggerHelper = require('./helpers/logger.helper');
const { config } = require('./config/config');

const logger = new LoggerHelper('index');
const { port } = config;
const app = express();

app.use(
  bodyParser.json({
    type: ['application/json'], // Solo parsea JSON si el Content-Type es "application/json"
    limit: '10mb',
  })
);

app.use(
  bodyParser.text({
    type: ['application/xml', 'text/xml'], // Solo parsea XML como texto
    limit: '10mb',
  })
);


app.use(helmet());
app.disable('x-powered-by');

/**
 * Registro de rutas principales.
 */
routes(app);

/**
 * Inicio del servidor en el puerto configurado.
 */
app.listen(port, () => {
  logger.info(`--------- [index] [app.listen] - Servidor escuchando en http://localhost:${port} ---------`);
});

module.exports = { app };
