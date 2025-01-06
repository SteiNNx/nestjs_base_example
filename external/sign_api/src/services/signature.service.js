// src/services/signature.service.js

/**
 * Servicio principal para la firma de XML a partir de un JSON.
 *
 * @module signatureService
 */

const { signXml } = require('../helpers/signature.helper');
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
 * @throws {Error} - Si ocurre un error durante la firma.
 */
const signXMLService = async (body) => {
  try {
    logger.info('Iniciando firma de XML a partir de JSON.');

    // Convertir JSON a XML
    const xmlString = jsonToXml(body);
    logger.debug('JSON convertido a XML correctamente.');

    // Firmar el XML
    const xmlSigned = signXml(xmlString);
    logger.info('XML firmado correctamente.');

    return xmlSigned;
  } catch (error) {
    logger.error('Error al firmar el XML.', error);
    throw error;
  }
};

module.exports = signXMLService;
