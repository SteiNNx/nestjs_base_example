// src/components/signature/signature.route.js

/**
 * Rutas relacionadas con la firma y validación de XML.
 *
 * @module signatureRoutes
 */
const LoggerHelper = require('../../helpers/logger.helper');
const validateAuthTokenMiddleware = require('../../middlewares/validate-auth-token.middleware');
const { signXMLController, validateSignXMLController } = require('./signature.controller');

const logger = new LoggerHelper('signature.route.js');

/**
 * Configura las rutas relacionadas con la firma y validación de XML en la aplicación.
 *
 * @function signatureRoutes
 * @param {Object} app - Instancia de la aplicación Express.
 * @param {string} pathPrefixApi - Prefijo para las rutas de la API.
 */
const signatureRoutes = (app, pathPrefixApi) => {
  // Ruta para firmar XML
  const signRoute = `${pathPrefixApi}/sign_xml`;
  logger.info(`Registrando ruta: [POST] ${signRoute}`);
  app.post(
    signRoute,
    validateAuthTokenMiddleware,
    signXMLController
  );

  // Ruta para validar la firma del XML
  const validateRoute = `${pathPrefixApi}/validate_sign_xml`;
  logger.info(`Registrando ruta: [POST] ${validateRoute}`);
  app.post(
    validateRoute,
    validateAuthTokenMiddleware,
    validateSignXMLController,
  );
};

module.exports = signatureRoutes;
