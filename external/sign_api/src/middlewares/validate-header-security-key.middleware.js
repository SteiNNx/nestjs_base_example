// src/middlewares/validate-header-security.middleware.js

const { getSecurityKey } = require('../providers/credentials.provider');

const AuthError = require('../exceptions/auth.exception');
const BadRequestError = require('../exceptions/bad-request.exception');
const TechnicalError = require('../exceptions/technical.exception');

const LoggerHelper = require('../helpers/logger.helper');
const logger = new LoggerHelper('validate-header-security.middleware.js');

/**
 * Middleware que valida un header de seguridad.
 * - Verifica si el header "x-security-header" existe.
 * - Compara su valor con la clave de seguridad definida en la configuración.
 * - Si la validación es correcta, permite continuar con la cadena de middlewares.
 * - Si falla, lanza un error que será manejado por el middleware global.
 *
 * @param {import('express').Request} req - Objeto de la solicitud de Express.
 * @param {import('express').Response} res - Objeto de la respuesta de Express.
 * @param {import('express').NextFunction} next - Siguiente middleware.
 */
const validateHeaderSecurityKeyMiddleware = (req, res, next) => {
  try {
    const headerName = 'x-security-header-key';
    const headerValue = req.headers[headerName];

    if (!headerValue) {
      // Lanzar un error de solicitud incorrecta si el header no está presente
      const error = new BadRequestError(
        'AUTH.HEADER.MISSING',
        `El header ${headerName} es requerido.`,
        400
      );
      return next(error);
    }

    const expectedSecurityKey = getSecurityKey();
    logger.info(`Clave de seguridad esperada: ${expectedSecurityKey}`);
    logger.info(`Valor recibido en header: ${headerValue}`);

    // Compara directamente el valor del header con la clave esperada
    if (headerValue !== expectedSecurityKey) {
      // Lanzar un error de autenticación si la clave no coincide
      const error = new AuthError(
        'AUTH.SECURITY_KEY.INVALID',
        'No autorizado: clave de seguridad incorrecta.',
        401
      );
      return next(error);
    }

    // Si todo está correcto, continuar con el siguiente middleware
    next();
  } catch (error) {
    logger.error(`Error en validate-header-security.middleware: ${error.message}`);
    // En caso de un error inesperado, se puede lanzar un error técnico
    const technicalError = new TechnicalError(
      'AUTH.MIDDLEWARE_ERROR',
      'Error interno en el middleware de validación de header de seguridad.',
      500,
      error
    );
    next(technicalError);
  }
};

module.exports = validateHeaderSecurityKeyMiddleware;
