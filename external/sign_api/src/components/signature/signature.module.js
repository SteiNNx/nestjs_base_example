// src/components/signature/signature.module.js

const signXMLService = require('../../services/signature.service');
const validateBodySchema = require('../../helpers/validate.helper');
const LoggerHelper = require('../../helpers/logger.helper');
const signXmlSchema = require('../../schemas/request/signXml.schema');

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
    logger.info('--------- [signature.module] [signXMLModule] - Step: Validando schema ---------');
    validateBodySchema(req.body, signXmlSchema, 'XXX.XXX.0001');
    logger.info('--------- [signature.module] [signXMLModule] - Step: Schema validado ---------');

    logger.info('--------- [signature.module] [signXMLModule] - Step: Llamando signXMLService ---------');
    const response = await signXMLService(req.body);
    logger.info('--------- [signature.module] [signXMLModule] - Step: Respuesta de signXMLService ---------', { response });
    
    logger.info('--------- [signature.module] [signXMLModule] - END ---------');
    return response;
  } catch (error) {
    logger.error('--------- [signature.module] [signXMLModule] - ERROR ---------', { error });
    throw error;
  }
};

module.exports = { signXMLModule };
