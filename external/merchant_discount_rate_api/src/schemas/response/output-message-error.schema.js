/**
 * Clase que representa un mensaje de salida para las respuestas de la API.
 * Esta clase se utiliza para estructurar de forma consistente los mensajes de error
 * que se devuelven desde la API, permitiendo una respuesta uniforme y clara.
 * 
 * @example
 * // Ejemplo de uso para manejar un error de autenticación
 * const authError = new OutputMessageError(
 *   'AuthError',
 *   'AUTH001',
 *   'Autenticación fallida. Credenciales incorrectas.',
 *   401,
 *   { attemptedEmail: 'usuario@example.com' }
 * );
 * 
 * console.log(authError);
 * // Salida esperada:
 * // OutputMessageError {
 * //   name: 'AuthError',
 * //   code: 'AUTH001',
 * //   message: 'Autenticación fallida. Credenciales incorrectas.',
 * //   statusCode: 401,
 * //   data: null,
 * //   details: { attemptedEmail: 'usuario@example.com' }
 * // }
 */
class OutputMessageError {
    /**
     * Crea una nueva instancia de OutputMessageError.
     * 
     * @constructor
     * @param {string} name - El nombre del error (e.g., 'AuthError', 'ValidationError').
     * @param {string} code - Un código único para Monitoreo (e.g., 'ESA.XXX.XXX').
     * @param {string} message - Un mensaje descriptivo del error para el usuario final.
     * @param {number} statusCode - Código de estado HTTP (e.g., 400, 401, 500).
     * @param {Object|null} [data=null] - Información adicional relacionada con el error (puede ser null).
     * @param {Object} [details={}] - Detalles adicionales sobre el error para propósitos de depuración.
     */
    constructor(name, statusCode, code, message, data = null, details = {}) {
        this.name = name;
        this.statusCode = statusCode;
        this.code = code;
        this.message = message;
        this.data = data;
        this.details = details;
    }
}

module.exports = OutputMessageError;
