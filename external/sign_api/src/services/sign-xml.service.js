// src/services/sign-xml.service.js

const { signXml } = require('../helpers/signature.helper');
const { jsonToXml, sanitizaXml } = require('../helpers/xml.helper');
const { handleThrownError } = require('../providers/error-handler.provider');

const LoggerHelper = require('../helpers/logger.helper');
const logger = new LoggerHelper('sign-xml.service.js');

/**
 * Convierte un objeto JSON a XML y procede a firmarlo.
 *
 * @async
 * @function signXMLService
 * @param {Object} body - Objeto JSON que se convertirá a XML.
 * @returns {Promise<String>} Cadena XML firmada.
 */
const signXMLService = async (body) => {
  logger.info('Inicio');

  try {
    logger.info('Convirtiendo JSON a XML');
    const xmlString = jsonToXml(body);
    logger.info('Conversión completada', { xmlString });

    logger.info('Sanitizando XML');
    const xmlStringSanitized = sanitizaXml(xmlString);
    logger.info('Sanitización de XML completada', { xmlStringSanitized });

    logger.info('Firmando XML');
    const xmlSigned = signXml(xmlStringSanitized);
    logger.info('Firma de XML completada', { xmlSigned });

    logger.info('Finalización exitosa');

    return xmlSigned;
  } catch (error) {
    logger.error('Error al firmar el XML', { error });
    // Lanza el error utilizando handleThrownError con un código y mensaje por defecto
    handleThrownError(error, 'SIGN.SIGN.0001', 'Error al firmar el XML.');
  }
};

module.exports = {
  signXMLService,
};
