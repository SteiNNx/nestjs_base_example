// src/exceptions/validation.exception.js
const BaseError = require('./base.exception');

/**
 * Clase para manejar errores de validación.
 * Esta clase extiende `BaseError` y se utiliza para representar errores específicos
 * relacionados con la validación de datos en la aplicación. Proporciona soporte para
 * un mensaje descriptivo, un código de error, un estado HTTP, una causa opcional, y
 * errores adicionales específicos de validación.
 *
 * @class ValidationError
 * @extends {BaseError}
 * @param {string} code - Código único que identifica el tipo de error de validación.
 * @param {string} message - Mensaje descriptivo que explica el problema del error.
 * @param {number} [statusCode=400] - Código de estado HTTP asociado al error (por defecto: 400).
 * @param {Error} [cause] - Causa original del error (opcional), para contexto adicional.
 * @param {Array<Object>} [errors=[]] - Lista de errores adicionales relacionados (opcional).
 *
 * @example
 * // Caso 1: Error de validación sin causa ni errores adicionales
 * throw new ValidationError('VALIDATION.001', 'El campo nombre es obligatorio.');
 *
 * // Resultado esperado:
 * // {
 * //   "name": "ValidationError",
 * //   "code": "VALIDATION.001",
 * //   "message": "El campo nombre es obligatorio.",
 * //   "statusCode": 400,
 * //   "errors": [],
 * //   "cause": undefined,
 * //   "stack": "ValidationError: El campo nombre es obligatorio..."
 * // }
 *
 * @example
 * // Caso 2: Error de validación con errores adicionales
 * throw new ValidationError('VALIDATION.002', 'El correo no es válido.', 422, null, [
 *   { field: 'email', message: 'El correo debe tener un formato válido.' }
 * ]);
 *
 * // Resultado esperado:
 * // {
 * //   "name": "ValidationError",
 * //   "code": "VALIDATION.002",
 * //   "message": "El correo no es válido.",
 * //   "statusCode": 422,
 * //   "errors": [{ field: "email", message: "El correo debe tener un formato válido." }],
 * //   "cause": undefined,
 * //   "stack": "ValidationError: El correo no es válido..."
 * // }
 *
 * @example
 * // Caso 3: Error de validación con causa y errores adicionales
 * const causeError = new Error('Formato incorrecto en la entrada.');
 * throw new ValidationError('VALIDATION.003', 'Error de validación en la entrada.', 400, causeError, [
 *   { field: 'nombre', message: 'El nombre es requerido.' },
 *   { field: 'email', message: 'El correo no es válido.' }
 * ]);
 *
 * // Resultado esperado:
 * // {
 * //   "name": "ValidationError",
 * //   "code": "VALIDATION.003",
 * //   "message": "Error de validación en la entrada.",
 * //   "statusCode": 400,
 * //   "errors": [
 * //     { field: "nombre", message: "El nombre es requerido." },
 * //     { field: "email", message: "El correo no es válido." }
 * //   ],
 * //   "cause": "Formato incorrecto en la entrada.",
 * //   "stack": "ValidationError: Error de validación en la entrada...\nCaused by: Formato incorrecto en la entrada."
 * // }
 */
class ValidationError extends BaseError {
    /**
     * @constructor
     * @param {string} code - Código único del error.
     * @param {string} message - Descripción del error.
     * @param {number} [statusCode=400] - Código HTTP asociado (opcional).
     * @param {Error} [cause] - Causa del error (opcional).
     * @param {Array<Object>} [errors=[]] - Lista de errores relacionados (opcional).
     */
    constructor(code, message, statusCode = 400, cause, errors = []) {
        super({
            message,
            code,
            name: 'ValidationError',
            statusCode,
            cause,
            errors,
        });
    }
}

module.exports = ValidationError;
