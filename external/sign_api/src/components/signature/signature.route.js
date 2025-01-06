const LoggerHelper = require('../../helpers/logger.helper');
const { signXMLController } = require("./signature.controller");

const logger = new LoggerHelper('signature.route');

/**
 * Configura las rutas relacionadas con el chequeo de salud en la aplicación.
 *
 * @function signatureRoutes
 * @param {Object} app - La instancia de la aplicación Express.
 * @param {string} pathPrefixApi - El prefijo para las rutas de la API.
 */
const signatureRoutes = (app, pathPrefixApi) => {
  app.get(
    `${pathPrefixApi}/healthcheck`,
    signXMLController
  );

  logger.info(`[RUTA REGISTRADA] [GET] ${pathPrefixApi}/healthcheck - healthcheck.route: healthCheckController`);
};

module.exports = signatureRoutes;