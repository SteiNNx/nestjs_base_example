// src/components/signature/signature.module.js

/**
 * Módulo que contiene la lógica para la firma y validación de XML.
 *
 * @module signatureModule
 */
const { signXMLService } = require('../../services/sign-xml.service');
const { validateSignXMLService } = require('../../services/validate-sign-xml.service');

const validateBodySchema = require('../../helpers/validate.helper');
const LoggerHelper = require('../../helpers/logger.helper');
const signXmlSchema = require('../../schemas/request/sign-xml.schema');

const logger = new LoggerHelper('signature.module');

/**
 * Firma un XML a partir de los datos recibidos en la solicitud.
 *
 * @async
 * @function signXMLModule
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @returns {Promise<String>} XML firmado.
 */
const signXMLModule = async (req) => {
  logger.info('[signXMLModule] Inicio');

  try {
    logger.info('[signXMLModule] Validando el esquema del cuerpo de la solicitud');
    validateBodySchema(req.body, signXmlSchema, 'XXX.XXX.0001');
    logger.info('[signXMLModule] Esquema validado correctamente');

    logger.info('[signXMLModule] Llamando a signXMLService');
    const signedXML = await signXMLService(req.body);
    logger.info('[signXMLModule] XML firmado recibido de signXMLService', { signedXML });

    logger.info('[signXMLModule] Finalización exitosa');

    return signedXML;
  } catch (error) {
    logger.error('[signXMLModule] Error durante la firma del XML', { error });
    throw error;
  }
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
  logger.info('[validateSignXMLModule] Inicio');

  try {
    logger.info('[validateSignXMLModule] Llamando a validateSignXMLService');
    // Se asume que req.body contiene el XML en crudo
    const rawXml = req.body;
    const validationResult = await validateSignXMLService(rawXml);
    logger.info('[validateSignXMLModule] Resultado recibido de validateSignXMLService', { validationResult });

    logger.info('[validateSignXMLModule] Finalización exitosa');

    return validationResult;
  } catch (error) {
    logger.error('[validateSignXMLModule] Error durante la validación del XML', { error });
    throw error;
  }
};

module.exports = {
  signXMLModule,
  validateSignXMLModule,
};
