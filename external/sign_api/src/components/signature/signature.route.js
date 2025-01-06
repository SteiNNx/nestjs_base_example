// src/components/signature/signature.route.js

/**
 * Rutas relacionadas con la firma de XML.
 *
 * @module signatureRoutes
 */

const LoggerHelper = require('../../helpers/logger.helper');
const { signXMLController } = require('./signature.controller');

const logger = new LoggerHelper('signature.route');

/**
 * Configura las rutas relacionadas con la firma de XML en la aplicación.
 *
 * @function signatureRoutes
 * @param {Object} app - La instancia de la aplicación Express.
 * @param {string} pathPrefixApi - El prefijo para las rutas de la API.
 */
const signatureRoutes = (app, pathPrefixApi) => {
  logger.info(`--------- [signature.route] [signatureRoutes] - Registrando ruta: [POST] ${pathPrefixApi}/sign_xml ---------`);

  app.post(
    `${pathPrefixApi}/sign_xml`,
    signXMLController
  );

};

module.exports = signatureRoutes;
