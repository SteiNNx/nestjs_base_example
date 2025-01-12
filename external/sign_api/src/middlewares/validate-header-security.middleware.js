// src/middlewares/validateHeaderSecurity.middleware.js

const { config } = require('../config/config');
const { encrypt, decrypt } = require('../helpers/crypto.helper');
const LoggerHelper = require('../helpers/logger.helper');

const logger = new LoggerHelper('validateHeaderSecurity.middleware');

/**
 * Middleware "perro" que valida un header de seguridad.
 * - Verifica si el header "x-security-header" existe.
 * - Desencripta su valor utilizando las claves definidas en config.
 * - Si la validación es correcta, permite continuar con la cadena de middlewares.
 * - Si falla, lanza un error que luego será manejado por el middleware global.
 *
 * @param {import('express').Request} req - Objeto de la solicitud de Express.
 * @param {import('express').Response} res - Objeto de la respuesta de Express.
 * @param {import('express').NextFunction} next - Siguiente middleware.
 */
const validateHeaderSecurityMiddleware = (req, res, next) => {
  try {
    const headerName = 'x-security-header';
    const encryptedHeader = req.headers[headerName];

    if (!encryptedHeader) {
      const error = new Error(`El header ${headerName} es requerido.`);
      error.statusCode = 400;
      throw error;
    }

    // Desencriptar el valor usando las claves definidas en config
    const decryptedValue = decrypt(
      encryptedHeader,
      config.encryptionKey,
      config.encryptionIv
    );
    logger.info(`Valor desencriptado del header: ${decryptedValue}`);

    // Aquí podrías agregar lógica adicional para verificar el token
    // Ejemplo:
    // if (decryptedValue !== 'valor-esperado') {
    //   const error = new Error('No estás autorizado.');
    //   error.statusCode = 401;
    //   throw error;
    // }

    next();
  } catch (error) {
    logger.error(`Error en validateHeaderSecurityMiddleware: ${error.message}`);
    next(error);
  }
};

module.exports = validateHeaderSecurityMiddleware;
