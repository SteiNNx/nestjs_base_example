// src/services/signature.service.js

/**
 * Servicio principal para la firma de XML a partir de un JSON.
 *
 * @module signatureService
 */

const { signXml, validateXmlSignature } = require('../helpers/signature.helper');
const { jsonToXml } = require('../helpers/xml.helper');
const LoggerHelper = require('../helpers/logger.helper');

const logger = new LoggerHelper('signature.service');

/**
 * Convierte un body JSON a XML y lo firma con la configuración definida.
 *
 * @async
 * @function signXMLService
 * @param {Object} body - Objeto JSON que se convertirá a XML.
 * @returns {Promise<String>} - Cadena XML firmada.
 */
const signXMLService = async (body) => {
  try {
    logger.info('--------- [signature.service] [signXMLService] - INIT ---------');

    // 1. Convertir JSON a XML
    logger.info('--------- [signature.service] [signXMLService] - Step: Convertir Json a XML ---------');
    const xmlString = jsonToXml(body);
    logger.info('--------- [signature.service] [signXMLService] - Step: Json convertido a XML ---------');

    // 2. Firmar el XML
    logger.info('--------- [signature.service] [signXMLService] - Step: Firmar XML ---------');
    const xmlSigned = signXml(xmlString);
    logger.info('--------- [signature.service] [signXMLService] - Step: XML Firmado ---------');

    logger.info('--------- [signature.service] [signXMLService] - END ---------');
    return xmlSigned;
  } catch (error) {
    logger.error('--------- [signature.service] [signXMLService] - ERROR ---------', { error });
    throw error;
  }
};

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
  signXMLService,
  validateSignXMLService,
};
