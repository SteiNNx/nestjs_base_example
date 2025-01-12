// src/components/healthcheck/healthcheck.route.js

/**
 * Rutas relacionadas con el chequeo de salud del servidor.
 *
 * @module healthCheckRoutes
 */
const LoggerHelper = require('../../helpers/logger.helper');
const healthCheckController = require('./healthcheck.controller');

const logger = new LoggerHelper('healthcheck.route');

/**
 * Configura las rutas de chequeo de salud en la aplicación.
 *
 * @function healthCheckRoutes
 * @param {Object} app - Instancia de la aplicación Express.
 * @param {string} pathPrefixApi - Prefijo para las rutas de la API.
 */
const healthCheckRoutes = (app, pathPrefixApi) => {
  const route = `${pathPrefixApi}/healthcheck`;

  logger.info(`[healthCheckRoutes] Registrando ruta: [GET] ${route}`);
  app.get(
    route,
    healthCheckController
  );
};

module.exports = healthCheckRoutes;
