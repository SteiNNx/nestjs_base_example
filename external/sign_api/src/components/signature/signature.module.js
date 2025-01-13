// src/components/signature/signature.module.js

/**
 * Módulo que contiene la lógica para la firma y validación de XML.
 *
 * @module signatureModule
 */
const { signXMLService } = require('../../services/sign-xml.service');
const { validateSignXMLService } = require('../../services/sign-xml-validate.service');

const validateBodySchema = require('../../helpers/validate.helper');
const LoggerHelper = require('../../helpers/logger.helper');
const signXmlSchema = require('../../schemas/request/sign-xml.schema');

const logger = new LoggerHelper('signature.module.js');

/**
 * Firma un XML a partir de los datos recibidos en la solicitud.
 *
 * @async
 * @function signXMLModule
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @returns {Promise<String>} XML firmado.
 */
const signXMLModule = async (req) => {
  logger.info('Validando el esquema del cuerpo de la solicitud');
  validateBodySchema(req.body, signXmlSchema, 'XXX.XXX.0001');
  logger.info('Esquema validado correctamente');

  logger.info('Llamando a signXMLService');
  const signedXML = await signXMLService(req.body);
  logger.info('XML firmado recibido de signXMLService', { signedXML });

  logger.info('Finalización exitosa');

  return signedXML;
};

/**
 * Valida la firma de un XML utilizando el contenido recibido en la solicitud.
 *
 * @async
 * @function validateSignXMLModule
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @returns {Promise<Object>} Objeto con los resultados de la validación (isValid y details).
 */
const validateSignXMLModule = async (req) => {

  logger.info('Llamando a validateSignXMLService');
  // Se asume que req.body contiene el XML en crudo
  const rawXml = req.body;
  const validationResult = await validateSignXMLService(rawXml);
  logger.info('Resultado recibido de validateSignXMLService', { validationResult });

  logger.info('Finalización exitosa');

  return validationResult;
};

module.exports = {
  signXMLModule,
  validateSignXMLModule,
};
