// src/services/sign-xml-validate.service.js

/**
 * Servicio principal para la validación de la firma de un XML.
 *
 * @module validateSignXMLService
 */
const { validateXmlSignature } = require('../helpers/signature.helper');
const { sanitizaXml } = require('../helpers/xml.helper');
const LoggerHelper = require('../helpers/logger.helper');

const logger = new LoggerHelper('validate-sign-xml.service');

/**
 * Valida la firma de un XML a partir de una cadena en crudo.
 *
 * @async
 * @function validateSignXMLService
 * @param {String} rawXml - Cadena XML que se desea validar.
 * @returns {Promise<{isValid: boolean, details: string}>} Objeto con el resultado de la validación.
 */
const validateSignXMLService = async (rawXml) => {
  logger.info('[validateSignXMLService] Inicio');

  try {

    logger.info('[validateSignXMLService] Sanitizando XML');
    const xmlStringSanitized = sanitizaXml(rawXml);
    logger.info('[validateSignXMLService] Sanitización de XML completada', { xmlStringSanitized });

    logger.info('[validateSignXMLService] Validando XML firmado');
    const result = validateXmlSignature(xmlStringSanitized);
    logger.info('[validateSignXMLService] Validación completada', { result });

    return result;
  } catch (error) {
    logger.error('[validateSignXMLService] Error al validar el XML', { error });
    throw error;
  }
};

module.exports = {
  validateSignXMLService,
};
