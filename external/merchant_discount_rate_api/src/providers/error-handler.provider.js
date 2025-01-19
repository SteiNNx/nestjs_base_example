// src/providers/error-handler.provider.js

const AdapterError = require('../exceptions/adapter.exception');
const AuthError = require('../exceptions/auth.exception');
const BadRequestError = require('../exceptions/bad-request.exception');
const BusinessError = require('../exceptions/bussiness.exception');
const InternalServerError = require('../exceptions/internal-server.exception');
const TechnicalError = require('../exceptions/technical.exception');
const ValidationError = require('../exceptions/validation.exception');

/**
 * Función para manejar errores conocidos y desconocidos,
 * pasando el error al siguiente middleware utilizando next(error).
 * Si el error es una instancia de alguno de los errores conocidos, se pasa directamente.
 * De lo contrario, se crea y pasa un nuevo TechnicalError con el código, mensaje y estado HTTP por defecto.
 *
 * @function handleNextError
 * @param {Error} error - Error capturado en el bloque catch.
 * @param {Function} next - Función next de Express.
 * @param {string} defaultErrorCode - Código de error por defecto para error desconocido.
 * @param {string} defaultErrorMessage - Mensaje de error por defecto para error desconocido.
 * @param {number} [defaultErrorHttpStatusCode=500] - Código HTTP de error por defecto.
 * @returns {void}
 */
const handleNextError = (error, next, defaultErrorCode, defaultErrorMessage, defaultErrorHttpStatusCode = 500) => {
  if (
    error instanceof AdapterError ||
    error instanceof AuthError ||
    error instanceof BadRequestError ||
    error instanceof BusinessError ||
    error instanceof InternalServerError ||
    error instanceof TechnicalError ||
    error instanceof ValidationError
  ) {
    return next(error);
  }
  return next(new TechnicalError(defaultErrorCode, defaultErrorMessage, defaultErrorHttpStatusCode, error));
};

/**
 * Función para manejar errores conocidos y desconocidos,
 * lanzando directamente el error.
 * Si el error es una instancia de alguno de los errores conocidos, se lanza sin modificaciones.
 * De lo contrario, se crea y lanza un nuevo TechnicalError con el código, mensaje y estado HTTP por defecto.
 *
 * @function handleThrownError
 * @param {Error} error - Error capturado en el bloque catch.
 * @param {string} defaultErrorCode - Código de error por defecto para error desconocido.
 * @param {string} defaultErrorMessage - Mensaje de error por defecto para error desconocido.
 * @param {number} [defaultErrorHttpStatusCode=500] - Código HTTP de error por defecto.
 * @throws {Error} El error original si es conocido o un nuevo TechnicalError en otro caso.
 */
const handleThrownError = (error, defaultErrorCode, defaultErrorMessage, defaultErrorHttpStatusCode = 500) => {
  if (
    error instanceof AdapterError ||
    error instanceof AuthError ||
    error instanceof BadRequestError ||
    error instanceof BusinessError ||
    error instanceof InternalServerError ||
    error instanceof TechnicalError ||
    error instanceof ValidationError
  ) {
    throw error;
  }
  throw new TechnicalError(defaultErrorCode, defaultErrorMessage, defaultErrorHttpStatusCode, error);
};

module.exports = {
  handleNextError,
  handleThrownError,
};
