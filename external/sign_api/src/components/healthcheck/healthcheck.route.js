const LoggerHelper = require('../../helpers/logger.helper');
const healthCheckController = require('./healthcheck.controller');

const logger = new LoggerHelper('healthcheck.route');

/**
 * Configura las rutas relacionadas con el chequeo de salud en la aplicación.
 *
 * @function healthCheckRoutes
 * @param {Object} app - La instancia de la aplicación Express.
 * @param {string} pathPrefixApi - El prefijo para las rutas de la API.
 */
const healthCheckRoutes = (app, pathPrefixApi) => {
  app.get(
    `${pathPrefixApi}/healthcheck`,
    healthCheckController
  );

  logger.info(`[RUTA REGISTRADA] [GET] ${pathPrefixApi}/healthcheck - healthcheck.route: healthCheckController`);
};

module.exports = healthCheckRoutes;
