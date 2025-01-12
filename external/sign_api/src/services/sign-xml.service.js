// src/services/sign-xml.service.js

/**
 * Servicio principal para la firma de XML a partir de un JSON.
 *
 * @module signatureService
 */

const { signXml } = require('../helpers/signature.helper');
const { jsonToXml } = require('../helpers/xml.helper');
const LoggerHelper = require('../helpers/logger.helper');

const logger = new LoggerHelper('sign-xml.service');

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


module.exports = {
  signXMLService,
};
