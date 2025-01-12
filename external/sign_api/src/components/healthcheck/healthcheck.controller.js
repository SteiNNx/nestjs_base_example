// src/components/healthcheck/healthcheck.controller.js

/**
 * Controlador para el chequeo de salud del servidor.
 *
 * @module healthCheckController
 */
const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('healthcheck.controller');

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * Realiza un chequeo de salud del servidor, configurando cabeceras de seguridad y enviando un mensaje de estado.
 *
 * @async
 * @function healthCheckController
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Response} Respuesta HTTP con estado 200 y mensaje "Service OK".
 */
const healthCheckController = async (req, res) => {
  logger.info('[healthCheckController] Inicio del chequeo de salud');

  // Configuración de cabeceras de seguridad
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "script-src 'self'");

  const response = { status: '00', message: 'Service OK' };
  logger.info('[healthCheckController] Respuesta generada', { response });

  return res.status(200).send(response);
};

module.exports = healthCheckController;
