// src/services/sign-xml.service.js

/**
 * Servicio principal para la firma de un XML a partir de un objeto JSON.
 *
 * @module signXMLService
 */
const { signXml } = require('../helpers/signature.helper');
const { jsonToXml, sanitizaXml } = require('../helpers/xml.helper');
const LoggerHelper = require('../helpers/logger.helper');

const logger = new LoggerHelper('sign-xml.service');

/**
 * Convierte un objeto JSON a XML y procede a firmarlo.
 *
 * @async
 * @function signXMLService
 * @param {Object} body - Objeto JSON que se convertirá a XML.
 * @returns {Promise<String>} Cadena XML firmada.
 */
const signXMLService = async (body) => {
  logger.info('[signXMLService] Inicio');

  try {
    logger.info('[signXMLService] Convirtiendo JSON a XML');
    const xmlString = jsonToXml(body);
    logger.info('[signXMLService] Conversión completada', { xmlString });

    logger.info('[signXMLService] Sanitizando XML');
    const xmlStringSanitized = sanitizaXml(xmlString);
    logger.info('[signXMLService] Sanitización de XML completada', { xmlStringSanitized });

    logger.info('[signXMLService] Firmando XML');
    const xmlSigned = signXml(xmlStringSanitized);
    logger.info('[signXMLService] Firma de XML completada', { xmlSigned });

    logger.info('[signXMLService] Finalización exitosa');

    return xmlSigned;
  } catch (error) {
    logger.error('[signXMLService] Error al firmar el XML', { error });
    throw error;
  }
};

module.exports = {
  signXMLService,
};
