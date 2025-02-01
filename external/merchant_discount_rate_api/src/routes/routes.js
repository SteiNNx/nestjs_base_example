// src/routes/routes.js

/**
 * Configura y registra todas las rutas de la aplicación.
 *
 * @module routes
 */

const healthCheckRoutes = require('../components/healthcheck/healthcheck.route');
const authRoutes = require('../components/auth/auth.route');
const cardBrandMdrRoutes = require('../components/card_brand_mdr/card_brand_mdr.routes');
const uploadFileMdrRoutes = require('../components/upload_file_mdr/upload_file_mdr.routes');

const globalErrorHandlerMiddleware = require('../middlewares/global-error-handler.middleware');
const InterceptorLoggerMiddleware = require('../middlewares/interceptor-logger.middleware');
const validateHeaderSecurityKeyMiddleware = require('../middlewares/validate-header-security-key.middleware');

const { config } = require('../config/config');

const LoggerHelper = require('../helpers/logger.helper');
const logger = new LoggerHelper('routes.js');

/**
 * Función para registrar todas las rutas y middlewares de la aplicación.
 *
 * @function routes
 * @param {import('express').Application} app - Instancia de la aplicación Express.
 */
const routes = (app) => {
  logger.info('[routes] Iniciando configuración de rutas');

  // ============================================================================
  // 1) Obtener el prefijo de API desde la configuración
  // ============================================================================
  const { prefixApi } = config;

  // ============================================================================
  // 2) Registrar middleware interceptor para logging de Request/Response
  // ============================================================================
  app.use(InterceptorLoggerMiddleware);
  app.use(validateHeaderSecurityKeyMiddleware);

  // ============================================================================
  // 3) Configurar rutas específicas de componentes
  // ============================================================================
  healthCheckRoutes(app, prefixApi);
  authRoutes(app, prefixApi);
  cardBrandMdrRoutes(app, prefixApi);
  uploadFileMdrRoutes(app, prefixApi);

  // ============================================================================
  // 4) Registrar middleware global de manejo de errores
  // ============================================================================
  app.use(globalErrorHandlerMiddleware);

  logger.info('[routes] Finalizando configuración de rutas');
};

module.exports = routes;
