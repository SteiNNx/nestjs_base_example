// src/components/signature/signature.route.js

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
  app.post(
    `${pathPrefixApi}/sign_xml`,
    signXMLController
  );

  logger.info(`[RUTA REGISTRADA] [POST] ${pathPrefixApi}/sign_xml - healthcheck.route: healthCheckController`);
};

module.exports = signatureRoutes;