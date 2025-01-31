// src/index.js

/**
 * Punto de entrada principal de la aplicación.
 * Configura el servidor Express, los middlewares globales y registra las rutas principales.
 *
 * @module index
 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const routes = require('./routes/routes');
const LoggerHelper = require('./helpers/logger.helper');
const { config } = require('./config/config');

const logger = new LoggerHelper('index');
const { port } = config;

const app = express();

// ============================================================================
// A) RUTA DE ARCHIVOS ESTÁTICOS
//    - Servimos la carpeta "_public" en la ruta "/static"
// ============================================================================
app.use('/static', express.static(path.join(__dirname, 'components', '_public')));

// ============================================================================
// B) CONFIGURACIÓN DE BODY PARSER PARA JSON Y XML
//    - Parsear JSON (Content-Type: application/json)
//    - Parsear XML como texto (Content-Type: application/xml o text/xml)
// ============================================================================
app.use(
  bodyParser.json({
    type: ['application/json'],
    limit: '10mb',
  })
);

app.use(
  bodyParser.text({
    type: ['application/xml', 'text/xml'],
    limit: '10mb',
  })
);

// ============================================================================
// C) APLICACIÓN DE HELMET PARA SEGURIDAD DE CABECERAS
// ============================================================================
app.use(helmet());
app.disable('x-powered-by');

// ============================================================================
// D) REGISTRO DE RUTAS PRINCIPALES DE LA APLICACIÓN
// ============================================================================
routes(app);

// ============================================================================
// E) INICIO DEL SERVIDOR EN EL PUERTO CONFIGURADO
// ============================================================================
app.listen(port, () => {
  logger.info(`[index] Servidor escuchando en http://localhost:${port}`);
  logger.info(`[index] Servidor Publico escuchando en http://localhost:${port}/static/index.html`);
});

module.exports = { app };
