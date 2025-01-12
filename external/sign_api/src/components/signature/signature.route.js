// src/components/signature/signature.route.js

/**
 * Rutas relacionadas con la firma y validación de XML.
 *
 * @module signatureRoutes
 */
const LoggerHelper = require('../../helpers/logger.helper');
const { signXMLController, validateSignXMLController } = require('./signature.controller');

const logger = new LoggerHelper('signature.route');

/**
 * Configura las rutas relacionadas con la firma y validación de XML en la aplicación.
 *
 * @function signatureRoutes
 * @param {Object} app - Instancia de la aplicación Express.
 * @param {string} pathPrefixApi - Prefijo para las rutas de la API.
 */
const signatureRoutes = (app, pathPrefixApi) => {
  const signRoute = `${pathPrefixApi}/sign_xml`;

  logger.info(`[signatureRoutes] Registrando ruta: [POST] ${signRoute}`);
  app.post(
    signRoute,
    signXMLController
  );

  const validateRoute = `${pathPrefixApi}/validate_sign_xml`;

  logger.info(`[signatureRoutes] Registrando ruta: [POST] ${validateRoute}`);
  app.post(
    validateRoute,
    validateSignXMLController
  );
};

module.exports = signatureRoutes;
