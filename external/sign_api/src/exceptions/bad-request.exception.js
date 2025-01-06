const BaseError = require('./base.exception');

/**
 * Clase para manejar errores de solicitud incorrecta (400 Bad Request).
 * Esta clase extiende `BaseError` y se utiliza para representar errores relacionados
 * con solicitudes mal formadas o inválidas enviadas por el cliente.
 * Proporciona soporte para un mensaje descriptivo, un código de error, un estado HTTP,
 * una causa opcional y una lista de errores relacionados.
 *
 * @class BadRequestError
 * @extends {BaseError}
 * @param {string} code - Código único que identifica el tipo de error.
 * @param {string} message - Mensaje descriptivo que explica el problema.
 * @param {number} [statusCode=400] - Código de estado HTTP asociado al error (por defecto: 400).
 * @param {Error} [cause] - Causa original del error (opcional), para contexto adicional.
 * @param {Array<Error>} [errors=[]] - Lista de errores adicionales relacionados (opcional).
 *
 * @example
 * // Caso 1: Error de solicitud incorrecta sin causa
 * throw new BadRequestError('BAD_REQUEST.001', 'El parámetro "id" es requerido.');
 *
 * // Resultado esperado:
 * // {
 * //   "name": "BadRequestError",
 * //   "code": "BAD_REQUEST.001",
 * //   "message": "El parámetro \"id\" es requerido.",
 * //   "statusCode": 400,
 * //   "errors": [],
 * //   "cause": undefined,
 * //   "stack": "BadRequestError: El parámetro \"id\" es requerido..."
 * // }
 *
 * @example
 * // Caso 2: Error de solicitud incorrecta con código de estado personalizado
 * throw new BadRequestError('BAD_REQUEST.002', 'La solicitud contiene datos inválidos.', 422);
 *
 * // Resultado esperado:
 * // {
 * //   "name": "BadRequestError",
 * //   "code": "BAD_REQUEST.002",
 * //   "message": "La solicitud contiene datos inválidos.",
 * //   "statusCode": 422,
 * //   "errors": [],
 * //   "cause": undefined,
 * //   "stack": "BadRequestError: La solicitud contiene datos inválidos..."
 * // }
 *
 * @example
 * // Caso 3: Error de solicitud incorrecta con causa
 * const validationError = new Error('Fallo al validar el campo "email".');
 * throw new BadRequestError('BAD_REQUEST.003', 'La validación de los datos falló.', 400, validationError);
 *
 * // Resultado esperado:
 * // {
 * //   "name": "BadRequestError",
 * //   "code": "BAD_REQUEST.003",
 * //   "message": "La validación de los datos falló.",
 * //   "statusCode": 400,
 * //   "errors": [],
 * //   "cause": "Fallo al validar el campo \"email\".",
 * //   "stack": "BadRequestError: La validación de los datos falló...\nCaused by: Fallo al validar el campo \"email\"."
 * // }
 */
class BadRequestError extends BaseError {
    /**
     * @constructor
     * @param {string} code - Código único del error.
     * @param {string} message - Descripción del error.
     * @param {number} [statusCode=400] - Código HTTP asociado (opcional).
     * @param {Error} [cause] - Causa del error (opcional).
     * @param {Array<Error>} [errors=[]] - Lista de errores relacionados (opcional).
     */
    constructor(code, message, statusCode = 400, cause, errors = []) {
        super({
            message,
            code,
            name: 'BadRequestError',
            statusCode,
            cause,
            errors,
        });
    }
}

module.exports = BadRequestError;
