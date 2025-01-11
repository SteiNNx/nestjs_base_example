// src/components/signature/signature.module.js

const { signXMLService, validateSignXMLService } = require('../../services/signature.service');
const validateBodySchema = require('../../helpers/validate.helper');
const LoggerHelper = require('../../helpers/logger.helper');
const signXmlSchema = require('../../schemas/request/signXml.schema');
// const validateSignXmlSchema = require('../../schemas/request/validateSignXml.schema');
// ^ Ya NO usaremos validateSignXmlSchema, pues ahora recibimos XML directamente.
 
const logger = new LoggerHelper('signature.module');

/**
 * Operación para firmar un XML a partir de un objeto JSON.
 *
 * @async
 * @function signXMLModule
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @returns {Promise<String>} - Cadena XML firmada.
 */
const signXMLModule = async (req) => {
  logger.info('--------- [signature.module] [signXMLModule] - INIT ---------');

  try {
    logger.info('--------- [signature.module] [signXMLModule] - Step: Validando schema (JSON) ---------');
    validateBodySchema(req.body, signXmlSchema, 'XXX.XXX.0001');
    logger.info('--------- [signature.module] [signXMLModule] - Step: Schema validado (JSON) ---------');

    logger.info('--------- [signature.module] [signXMLModule] - Step: Llamando signXMLService ---------');
    const response = await signXMLService(req.body);
    logger.info('--------- [signature.module] [signXMLModule] - Step: Respuesta de signXMLService ---------', {
      xmlSigned: response,
    });

    logger.info('--------- [signature.module] [signXMLModule] - END ---------');
    return response;
  } catch (error) {
    logger.error('--------- [signature.module] [signXMLModule] - ERROR ---------', { error });
    throw error;
  }
};

/**
 * Operación para validar la firma de un XML.
 * AHORA:
 * - Se recibe el XML directamente (texto) en `req.body`.
 *
 * @async
 * @function validateSignXMLModule
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @returns {Promise<Object>} - Objeto con información de validación (isValid, details).
 */
const validateSignXMLModule = async (req) => {
  logger.info('--------- [signature.module] [validateSignXMLModule] - INIT ---------');

  try {
    logger.info('--------- [signature.module] [validateSignXMLModule] - Step: Llamando validateSignXMLService ---------');
    
    // req.body es el XML en crudo
    const rawXml = req.body;

    const validationResult = await validateSignXMLService(rawXml);
    logger.info('--------- [signature.module] [validateSignXMLModule] - Step: Respuesta de validateSignXMLService ---------', {
      validationResult,
    });

    logger.info('--------- [signature.module] [validateSignXMLModule] - END ---------');
    return validationResult;
  } catch (error) {
    logger.error('--------- [signature.module] [validateSignXMLModule] - ERROR ---------', { error });
    throw error;
  }
};

module.exports = {
  signXMLModule,
  validateSignXMLModule,
};
