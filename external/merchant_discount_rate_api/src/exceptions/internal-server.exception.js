// src/exceptions/internal-server.exception.js
const BaseError = require('./base.exception');

/**
 * Clase para manejar errores internos del servidor (500 Internal Server Error).
 * Esta clase extiende `BaseError` y se utiliza para representar errores internos
 * inesperados que ocurren en el servidor. Proporciona soporte para un mensaje
 * descriptivo, un código de error, un estado HTTP, y una causa opcional para contexto adicional.
 *
 * @class InternalServerError
 * @extends {BaseError}
 * @param {string} code - Código único que identifica el tipo de error interno.
 * @param {string} message - Mensaje descriptivo que explica el problema del error.
 * @param {number} [statusCode=500] - Código de estado HTTP asociado al error (por defecto: 500).
 * @param {Error} [cause] - Causa original del error (opcional), para contexto adicional.
 * @param {Array<Error>} [errors=[]] - Lista de errores adicionales relacionados (opcional).
 *
 * @example
 * // Caso 1: Error interno del servidor sin causa
 * throw new InternalServerError('SERVER.001', 'Ocurrió un error inesperado en el servidor.');
 *
 * // Resultado esperado:
 * // {
 * //   "name": "InternalServerError",
 * //   "code": "SERVER.001",
 * //   "message": "Ocurrió un error inesperado en el servidor.",
 * //   "statusCode": 500,
 * //   "errors": [],
 * //   "cause": undefined,
 * //   "stack": "InternalServerError: Ocurrió un error inesperado en el servidor..."
 * // }
 *
 * @example
 * // Caso 2: Error interno del servidor con código de estado personalizado
 * throw new InternalServerError('SERVER.002', 'Error en la base de datos.', 503);
 *
 * // Resultado esperado:
 * // {
 * //   "name": "InternalServerError",
 * //   "code": "SERVER.002",
 * //   "message": "Error en la base de datos.",
 * //   "statusCode": 503,
 * //   "errors": [],
 * //   "cause": undefined,
 * //   "stack": "InternalServerError: Error en la base de datos..."
 * // }
 *
 * @example
 * // Caso 3: Error interno del servidor con causa
 * const causeError = new Error('Error en el sistema de almacenamiento.');
 * throw new InternalServerError('SERVER.003', 'No se pudo completar la operación.', 500, causeError);
 *
 * // Resultado esperado:
 * // {
 * //   "name": "InternalServerError",
 * //   "code": "SERVER.003",
 * //   "message": "No se pudo completar la operación.",
 * //   "statusCode": 500,
 * //   "errors": [],
 * //   "cause": "Error en el sistema de almacenamiento.",
 * //   "stack": "InternalServerError: No se pudo completar la operación...\nCaused by: Error en el sistema de almacenamiento."
 * // }
 */
class InternalServerError extends BaseError {
    /**
     * @constructor
     * @param {string} code - Código único del error.
     * @param {string} message - Descripción del error.
     * @param {number} [statusCode=500] - Código HTTP asociado (opcional).
     * @param {Error} [cause] - Causa del error (opcional).
     * @param {Array<Error>} [errors=[]] - Lista de errores relacionados (opcional).
     */
    constructor(code, message, statusCode = 500, cause, errors = []) {
        super({
            message,
            code,
            name: 'InternalServerError',
            statusCode,
            cause,
            errors,
        });
    }
}

module.exports = InternalServerError;
