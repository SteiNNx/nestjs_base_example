const BaseError = require('./base.exception');

/**
 * Clase para manejar errores de autenticación.
 * Esta clase extiende `BaseError` y se utiliza para representar errores específicos
 * relacionados con la autenticación de usuarios. Proporciona opciones para establecer
 * un código de estado HTTP, un mensaje descriptivo, una causa opcional y errores adicionales.
 *
 * @class AuthError
 * @extends {BaseError}
 * @param {string} code - Código único que identifica el tipo de error de autenticación.
 * @param {string} message - Mensaje descriptivo que explica el problema del error.
 * @param {number} [statusCode=401] - Código de estado HTTP asociado al error (por defecto: 401).
 * @param {Error} [cause] - Causa original del error (opcional), para mayor contexto y depuración.
 * @param {Array<Error>} [errors=[]] - Lista de errores adicionales relacionados (opcional).
 *
 * @example
 * // Caso 1: Error de autenticación sin causa
 * throw new AuthError('AUTH.001', 'Token de autenticación inválido.');
 *
 * // Resultado esperado:
 * // {
 * //   "name": "AuthError",
 * //   "code": "AUTH.001",
 * //   "message": "Token de autenticación inválido.",
 * //   "statusCode": 401,
 * //   "errors": [],
 * //   "cause": undefined,
 * //   "stack": "AuthError: Token de autenticación inválido..."
 * // }
 *
 * @example
 * // Caso 2: Error de autenticación con código de estado personalizado
 * throw new AuthError('AUTH.002', 'Credenciales no válidas.', 403);
 *
 * // Resultado esperado:
 * // {
 * //   "name": "AuthError",
 * //   "code": "AUTH.002",
 * //   "message": "Credenciales no válidas.",
 * //   "statusCode": 403,
 * //   "errors": [],
 * //   "cause": undefined,
 * //   "stack": "AuthError: Credenciales no válidas..."
 * // }
 *
 * @example
 * // Caso 3: Error de autenticación con causa
 * const causeError = new Error('Fallo en el proceso de autenticación.');
 * throw new AuthError('AUTH.003', 'Error en el inicio de sesión.', 401, causeError);
 *
 * // Resultado esperado:
 * // {
 * //   "name": "AuthError",
 * //   "code": "AUTH.003",
 * //   "message": "Error en el inicio de sesión.",
 * //   "statusCode": 401,
 * //   "errors": [],
 * //   "cause": "Fallo en el proceso de autenticación.",
 * //   "stack": "AuthError: Error en el inicio de sesión...\nCaused by: Fallo en el proceso de autenticación."
 * // }
 */
class AuthError extends BaseError {
    /**
     * @constructor
     * @param {string} code - Código único del error.
     * @param {string} message - Descripción del error.
     * @param {number} [statusCode=401] - Código HTTP (opcional).
     * @param {Error} [cause] - Causa del error (opcional).
     * @param {Array<Error>} [errors=[]] - Lista de errores relacionados (opcional).
     */
    constructor(code, message, statusCode = 401, cause, errors = []) {
        super({
            message,
            code,
            name: 'AuthError',
            statusCode,
            cause,
            errors,
        });
    }
}

module.exports = AuthError;
