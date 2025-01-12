// src/services/validate-sign-xml.service.js

/**
 * Servicio principal para la firma de XML a partir de un JSON.
 *
 * @module signatureService
 */

const { validateXmlSignature } = require('../helpers/signature.helper');
const LoggerHelper = require('../helpers/logger.helper');

const logger = new LoggerHelper('validate-sign-xml.service');

/**
 * Valida la firma de un XML.
 *
 * AHORA: Recibe la cadena de XML en bruto (rawXml).
 *
 * @async
 * @function validateSignXMLService
 * @param {String} rawXml - Cadena XML firmada.
 * @returns {Promise<{isValid: boolean, details: string}>} - Resultado de la validación.
 */
const validateSignXMLService = async (rawXml) => {
  try {
    logger.info('--------- [signature.service] [validateSignXMLService] - INIT ---------');

    // Llamar a la función helper para validar
    logger.info('--------- [signature.service] [validateSignXMLService] - Step: Validar XML firmado ---------');
    const result = validateXmlSignature(rawXml);

    logger.info('--------- [signature.service] [validateSignXMLService] - END ---------');
    return result;
  } catch (error) {
    logger.error('--------- [signature.service] [validateSignXMLService] - ERROR ---------', { error });
    throw error;
  }
};

module.exports = {
  validateSignXMLService,
};
