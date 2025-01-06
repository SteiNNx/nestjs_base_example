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
  logger.info('------------- INIT signXMLModule -------------');

  try {
    logger.info('signXMLModule iniciando validacion Schema.');
    validateBodySchema(req.body, signXmlSchema, 'XXX.XXX.0001');
    logger.info('signXMLModule Schema validado.');

    const response = await signXMLService(req.body);
    logger.info('signXMLModule completado con éxito.');
    return response;
  } catch (error) {
    logger.error('Error en signXMLModule: ', error);
    throw error;
  }
};

module.exports = { signXMLModule };
