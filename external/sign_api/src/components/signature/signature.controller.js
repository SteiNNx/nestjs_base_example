// src/components/signature/signature.controller.js

/**
 * Controlador para la firma de XML.
 *
 * @module signatureController
 */

const signatureModule = require('./signature.module');

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * Operación para firmar un XML.
 *
 * @async
 * @function signXMLController
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<Response>} Respuesta con el estado 200 y el XML firmado.
 */
const signXMLController = async (req, res) => {
  const response = await signatureModule(req);

  // Configuración de cabeceras de seguridad
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "script-src 'self'");

  return res.status(200)
    .type('application/xml')
    .send(response);
};

module.exports = {
  signXMLController,
};
