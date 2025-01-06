// src/index.js

/**
 * Punto de entrada principal de la aplicación.
 * Configura el servidor Express y registra las rutas principales.
 *
 * @module index
 */

const express = require('express');
const bodyParser = require('body-parser');
const { config } = require('./config/config');
const routes = require('./routes/routes');
const LoggerHelper = require('./helpers/logger.helper');

const logger = new LoggerHelper('index');
const { port } = config;
const app = express();

/**
 * Middleware para parsear JSON del body.
 */
app.use(bodyParser.json());

/**
 * Registro de rutas principales.
 */
routes(app);

/**
 * Inicio del servidor en el puerto configurado.
 */
app.listen(port, () => {
  logger.info(`Servidor escuchando en http://localhost:${port}`);
});

