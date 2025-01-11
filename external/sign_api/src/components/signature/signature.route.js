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
 * Configura las rutas relacionadas con la firma/validación de XML en la aplicación.
 *
 * @function signatureRoutes
 * @param {Object} app - La instancia de la aplicación Express.
 * @param {string} pathPrefixApi - El prefijo para las rutas de la API.
 */
const signatureRoutes = (app, pathPrefixApi) => {
  logger.info(`--------- [signature.route] [signatureRoutes] - Registrando ruta: [POST] ${pathPrefixApi}/sign_xml ---------`);
  app.post(
    `${pathPrefixApi}/sign_xml`,
    signXMLController,
  );

  logger.info(`--------- [signature.route] [signatureRoutes] - Registrando ruta: [POST] ${pathPrefixApi}/validate_sign_xml ---------`);
  app.post(
    `${pathPrefixApi}/validate_sign_xml`,
    validateSignXMLController,
  );
};

module.exports = signatureRoutes;
