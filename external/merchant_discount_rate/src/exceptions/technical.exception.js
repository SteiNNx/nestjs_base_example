// src/exceptions/technical.exception.js
const BaseError = require('./base.exception');

/**
 * Clase para manejar errores técnicos.
 * Esta clase extiende `BaseError` y se utiliza para representar errores específicos
 * relacionados con problemas técnicos durante el funcionamiento de la aplicación.
 * Proporciona soporte para un mensaje descriptivo, un código de error, un estado HTTP,
 * y una causa opcional para contexto adicional.
 *
 * @class TechnicalError
 * @extends {BaseError}
 * @param {string} code - Código único que identifica el tipo de error técnico.
 * @param {string} message - Mensaje descriptivo que explica el problema del error.
 * @param {number} [statusCode=500] - Código de estado HTTP asociado al error (por defecto: 500).
 * @param {Error} [cause] - Causa original del error (opcional), para contexto adicional.
 *
 * @example
 * // Caso 1: Error técnico sin causa
 * throw new TechnicalError('TECH.001', 'Ocurrió un error técnico inesperado.');
 *
 * // Resultado esperado:
 * // {
 * //   "name": "TechnicalError",
 * //   "code": "TECH.001",
 * //   "message": "Ocurrió un error técnico inesperado.",
 * //   "statusCode": 500,
 * //   "errors": [],
 * //   "cause": undefined,
 * //   "stack": "TechnicalError: Ocurrió un error técnico inesperado..."
 * // }
 *
 * @example
 * // Caso 2: Error técnico con código de estado personalizado
 * throw new TechnicalError('TECH.002', 'Error de conexión con el servidor.', 503);
 *
 * // Resultado esperado:
 * // {
 * //   "name": "TechnicalError",
 * //   "code": "TECH.002",
 * //   "message": "Error de conexión con el servidor.",
 * //   "statusCode": 503,
 * //   "errors": [],
 * //   "cause": undefined,
 * //   "stack": "TechnicalError: Error de conexión con el servidor..."
 * // }
 *
 * @example
 * // Caso 3: Error técnico con causa
 * const causeError = new Error('Timeout en el servicio de base de datos.');
 * throw new TechnicalError('TECH.003', 'Error al acceder a los datos.', 500, causeError);
 *
 * // Resultado esperado:
 * // {
 * //   "name": "TechnicalError",
 * //   "code": "TECH.003",
 * //   "message": "Error al acceder a los datos.",
 * //   "statusCode": 500,
 * //   "errors": [],
 * //   "cause": "Timeout en el servicio de base de datos.",
 * //   "stack": "TechnicalError: Error al acceder a los datos...\nCaused by: Timeout en el servicio de base de datos."
 * // }
 */
class TechnicalError extends BaseError {
    /**
     * @constructor
     * @param {string} code - Código único del error.
     * @param {string} message - Descripción del error.
     * @param {number} [statusCode=500] - Código HTTP asociado (opcional).
     * @param {Error} [cause] - Causa del error (opcional).
     */
    constructor(code, message, statusCode = 500, cause) {
        super({
            message,
            code,
            name: 'TechnicalError',
            statusCode,
            cause,
        });
    }
}

module.exports = TechnicalError;
