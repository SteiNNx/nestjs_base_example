
// src/components/healthcheck/healthcheck.controller.js

/**
 * Controlador para el chequeo de salud del servidor.
 *
 * @module healthCheckController
 */

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * Operación para realizar un chequeo de salud del servidor.
 *
 * @function healthCheckController
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Response} Respuesta con estado 200 y mensaje de "Service OK".
 */
const healthCheckController = async (req, res) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "script-src 'self'");
  
    return res.status(200).send({ status: '00', message: 'Service OK' });
  };
  
  module.exports = healthCheckController;
  