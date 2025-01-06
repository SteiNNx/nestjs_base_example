// src/routes/routes.js

/**
 * Configura y registra todas las rutas de la aplicación.
 *
 * @module routes
 */

const healthCheckRoutes = require('../components/healthcheck/healthcheck.route');
const signatureRoutes = require('../components/signature/signature.route');
const globalErrorHandlerMiddleware = require('../middlewares/globalErrorHandler.middleware');
const { config } = require('../config/config');



const LoggerHelper = require('../helpers/logger.helper');

const logger = new LoggerHelper('routes');

/**
 * Función para registrar todas las rutas de la aplicación.
 *
 * @param {import('express').Application} app - La instancia de la aplicación Express.
 */
const routes = (app) => {
  logger.info(`Iniciando configuración de [routes]`);

  const { prefixApi } = config;

  healthCheckRoutes(app, prefixApi);
  signatureRoutes(app, prefixApi);

  app.use(globalErrorHandlerMiddleware);

  logger.info(`Finalizando configuración de [routes]`);
};

module.exports = routes;
