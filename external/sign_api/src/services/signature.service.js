// src/services/signature.service.js

const { signXml } = require("../helpers/signature.helper");
const { jsonToXml } = require("../helpers/xml.helper");

/**
 * Operacion para realizar un chequeo de salud del servidor.
 * 
 * @function signXMLService
 * @param {Object} body - Objeto de solicitud HTTP de Express.
 * @returns {Object} Respuesta con el estado 200 y un mensaje "OK".
 * 
 */
const signXMLService = async (body) => {

  // Convertir JSON a XML
  const xmlString = jsonToXml(body);

  // Firmar el XML
  const xmlSigned = signXml(xmlString);

  return xmlSigned;
}

module.exports = signXMLService;