// src/middlewares/validateHeaderSecurity.middleware.js

const { config } = require('../config/config');
const { encrypt, decrypt } = require('../helpers/crypto.helper');
const LoggerHelper = require('../helpers/logger.helper');

const logger = new LoggerHelper('validateHeaderSecurity.middleware');

/**
 * Middleware que valida (por ejemplo) un header encriptado.
 * - Verifica si el header existe.
 * - Lo desencripta usando las llaves de config.
 * - Aplica la lógica de negocio (e.g. verificar tokens, firmas, etc.)
 *
 * @param {import('express').Request} req - Objeto de la solicitud de Express
 * @param {import('express').Response} res - Objeto de la respuesta de Express
 * @param {import('express').NextFunction} next - Siguiente middleware
 */
function validateHeaderSecurityMiddleware(req, res, next) {
  try {
    const headerName = 'x-security-header';
    const encryptedHeader = req.headers[headerName];

    if (!encryptedHeader) {
      // Lanzamos un error con un status 400 por ejemplo:
      const err = new Error(`El header ${headerName} es requerido.`);
      err.statusCode = 400;
      throw err;
    }

    // Desencriptar el valor usando nuestras claves
    const decryptedValue = decrypt(
      encryptedHeader,
      config.encryptionKey,
      config.encryptionIv
    );

    logger.info(`Valor desencriptado del header: ${decryptedValue}`);

    // Aquí puedes realizar la lógica de validación que necesites
    // Ejemplo: si el valor desencriptado no coincide con lo esperado,
    // lanzar un error 401 (Unauthorized)
    // if (decryptedValue !== 'valor-esperado') {
    //   const err = new Error('No estás autorizado.');
    //   err.statusCode = 401;
    //   throw err;
    // }

    // Si todo está OK, continuar
    next();
  } catch (error) {
    // Manejo de error en el middleware
    logger.error(`Error en validateHeaderSecurityMiddleware: ${error.message}`);
    // Pasamos el error al manejador global
    next(error);
  }
}

module.exports = validateHeaderSecurityMiddleware;
