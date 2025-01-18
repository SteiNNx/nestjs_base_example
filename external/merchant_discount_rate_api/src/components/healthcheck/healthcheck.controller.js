// src/components/healthcheck/healthcheck.controller.js

/**
 * Controlador para el chequeo de salud del servidor.
 *
 * @module healthCheckController
 */

const { handleNextError } = require('../../providers/error-handler.provider');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('healthcheck.controller.js');

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
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<import('express').Response>} Respuesta HTTP con estado 200 y mensaje "Service OK".
 */
const healthCheckController = async (req, res, next) => {
  logger.info('Inicio del chequeo de salud');

  try {
    // Configuración de cabeceras de seguridad
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "script-src 'self'");

    const response = { status: '00', message: 'Service OK' };
    logger.info('Respuesta generada', { response });

    return res.status(200).send(response);
  } catch (error) {
    logger.error('Error en chequeo de salud (healthcheck)', { error: error.message });

    return handleNextError(error, next, 'HEALTH.CHECK.0001', 'Error desconocido en chequeo de salud.');
  }
};

module.exports = healthCheckController;
