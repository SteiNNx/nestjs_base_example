// src/exceptions/bussiness.exception.js
const BaseError = require('./base.exception');

/**
 * Clase para manejar errores de negocio.
 * Esta clase extiende `BaseError` y se utiliza para representar errores específicos
 * relacionados con la lógica de negocio en la aplicación. Proporciona soporte para un mensaje
 * descriptivo, un código de error, un estado HTTP, y una causa opcional para contexto adicional.
 *
 * @class BusinessError
 * @extends {BaseError}
 * @param {string} code - Código único que identifica el tipo de error de negocio.
 * @param {string} message - Mensaje descriptivo que explica el problema del error.
 * @param {number} [statusCode=500] - Código de estado HTTP asociado al error (por defecto: 500).
 * @param {Error} [cause] - Causa original del error (opcional), para contexto adicional.
 *
 * @example
 * // Caso 1: Error de negocio sin causa
 * throw new BusinessError('BUSINESS.001', 'Ocurrió un error de negocio inesperado.');
 *
 * // Resultado esperado:
 * // {
 * //   "name": "BusinessError",
 * //   "code": "BUSINESS.001",
 * //   "message": "Ocurrió un error de negocio inesperado.",
 * //   "statusCode": 500,
 * //   "errors": [],
 * //   "cause": undefined,
 * //   "stack": "BusinessError: Ocurrió un error de negocio inesperado..."
 * // }
 *
 * @example
 * // Caso 2: Error de negocio con código de estado personalizado
 * throw new BusinessError('BUSINESS.002', 'El proceso de pago ha fallado.', 400);
 *
 * // Resultado esperado:
 * // {
 * //   "name": "BusinessError",
 * //   "code": "BUSINESS.002",
 * //   "message": "El proceso de pago ha fallado.",
 * //   "statusCode": 400,
 * //   "errors": [],
 * //   "cause": undefined,
 * //   "stack": "BusinessError: El proceso de pago ha fallado..."
 * // }
 *
 * @example
 * // Caso 3: Error de negocio con causa
 * const causeError = new Error('Fallo en el servicio de pagos.');
 * throw new BusinessError('BUSINESS.003', 'Error al procesar la solicitud de pago.', 500, causeError);
 *
 * // Resultado esperado:
 * // {
 * //   "name": "BusinessError",
 * //   "code": "BUSINESS.003",
 * //   "message": "Error al procesar la solicitud de pago.",
 * //   "statusCode": 500,
 * //   "errors": [],
 * //   "cause": "Fallo en el servicio de pagos.",
 * //   "stack": "BusinessError: Error al procesar la solicitud de pago...\nCaused by: Fallo en el servicio de pagos."
 * // }
 */
class BusinessError extends BaseError {
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
            name: 'BusinessError',
            statusCode,
            cause,
        });
    }
}

module.exports = BusinessError;
