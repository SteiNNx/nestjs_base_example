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
// A) CONTROLADOR DE ARCHIVOS PÚBLICOS
//    - Se delega la entrega de la parte "pública" a un controller ubicado en
//      "src/components/_public". Así se evita colidir con otras rutas.
// ============================================================================
// Al acceder a /static o /static/upload_file_mdr se invoca el controller.
app.use('/static', require('./components/_public/controller'));

// ============================================================================
// B) CONFIGURACIÓN DE BODY PARSER PARA JSON Y XML
//    - Parsea JSON (Content-Type: application/json)
//    - Parsea XML como texto (Content-Type: application/xml o text/xml)
// ============================================================================
app.use(
  bodyParser.json({
    type: ['application/json'],
    limit: '10mb'
  })
);
app.use(
  bodyParser.text({
    type: ['application/xml', 'text/xml'],
    limit: '10mb'
  })
);

// ============================================================================
// C) APLICACIÓN DE HELMET PARA SEGURIDAD DE CABECERAS
// ============================================================================
app.use(helmet());
app.disable('x-powered-by');

// ============================================================================
// D) CONFIGURACIÓN DEL MOTOR DE VISTAS (EJS)
// ============================================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================================================
// E) REGISTRO DE RUTAS PRINCIPALES DE LA APLICACIÓN
//    - Se registran otras rutas (por ejemplo, el endpoint /upload para recibir el formulario).
// ============================================================================
routes(app);

// ============================================================================
// F) INICIO DEL SERVIDOR EN EL PUERTO CONFIGURADO
// ============================================================================
app.listen(port, () => {
  logger.info(`[index] Servidor escuchando en http://localhost:${port}`);
  logger.info(`[index] Vista Pública accesible en http://localhost:${port}/static/upload_file_mdr`);
});

module.exports = { app };
