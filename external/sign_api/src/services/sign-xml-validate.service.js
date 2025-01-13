// src/services/validate-sign-xml.service.js

const { validateXmlSignature } = require('../helpers/signature.helper');
const { sanitizaXml } = require('../helpers/xml.helper');
const { handleThrownError } = require('../providers/error-handler.provider');

const LoggerHelper = require('../helpers/logger.helper');
const logger = new LoggerHelper('validate-sign-xml.service.js');

/**
 * Valida la firma de un XML a partir de una cadena en crudo.
 *
 * @async
 * @function validateSignXMLService
 * @param {String} rawXml - Cadena XML que se desea validar.
 * @returns {Promise<{isValid: boolean, details: string}>} Objeto con el resultado de la validación.
 */
const validateSignXMLService = async (rawXml) => {
  logger.info('Inicio');

  try {
    logger.info('Sanitizando XML');
    const xmlStringSanitized = sanitizaXml(rawXml);
    logger.info('Sanitización de XML completada', { xmlStringSanitized });

    logger.info('Validando XML firmado');
    const result = validateXmlSignature(xmlStringSanitized);
    logger.info('Validación completada', { result });

    return result;
  } catch (error) {
    logger.error('Error al validar el XML', { error });
    // Lanza el error usando el método handleThrownError
    handleThrownError(error, 'SIGN.VALIDATE.0001', 'Error al validar la firma del XML.');
  }
};

module.exports = {
  validateSignXMLService,
};
