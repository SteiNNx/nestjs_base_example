const BaseError = require('./base.exception');

/**
 * Clase para manejar errores de adaptadores o integraciones externas.
 * Esta clase extiende `BaseError` y se utiliza para representar errores específicos
 * que ocurren durante interacciones con adaptadores externos o servicios.
 * Proporciona opciones para establecer un código de estado HTTP, un mensaje descriptivo
 * y registrar una causa original para diagnósticos detallados.
 * 
 * @class AdapterError
 * @extends {BaseError}
 * @param {string} code - Código único que identifica el tipo de error de adaptador.
 * @param {string} message - Mensaje descriptivo que explica el problema del error.
 * @param {number} [statusCode=502] - Código de estado HTTP asociado al error (por defecto: 502).
 * @param {Error} [cause] - Causa original del error (opcional), para mayor contexto y depuración.
 * 
 * @example
 * // Caso 1: Error de adaptador sin causa
 * throw new AdapterError('ADAPTER.001', 'Error al conectarse con el servicio externo.');
 * 
 * // Resultado esperado:
 * // {
 * //   "name": "AdapterError",
 * //   "code": "ADAPTER.001",
 * //   "message": "Error al conectarse con el servicio externo.",
 * //   "statusCode": 502,
 * //   "errors": [],
 * //   "cause": undefined,
 * //   "stack": "AdapterError: Error al conectarse con el servicio externo..."
 * // }
 * 
 * @example
 * // Caso 2: Error de adaptador con código de estado personalizado
 * throw new AdapterError('ADAPTER.002', 'Servicio externo no disponible.', 503);
 * 
 * // Resultado esperado:
 * // {
 * //   "name": "AdapterError",
 * //   "code": "ADAPTER.002",
 * //   "message": "Servicio externo no disponible.",
 * //   "statusCode": 503,
 * //   "errors": [],
 * //   "cause": undefined,
 * //   "stack": "AdapterError: Servicio externo no disponible..."
 * // }
 * 
 * @example
 * // Caso 3: Error de adaptador con causa
 * const causeError = new Error('Timeout en la conexión al servicio.');
 * throw new AdapterError('ADAPTER.003', 'Error al acceder al recurso externo.', 502, causeError);
 * 
 * // Resultado esperado:
 * // {
 * //   "name": "AdapterError",
 * //   "code": "ADAPTER.003",
 * //   "message": "Error al acceder al recurso externo.",
 * //   "statusCode": 502,
 * //   "errors": [],
 * //   "cause": "Timeout en la conexión al servicio.",
 * //   "stack": "AdapterError: Error al acceder al recurso externo...\nCaused by: Timeout en la conexión al servicio."
 * // }
 */
class AdapterError extends BaseError {
    /**
     * @constructor
     * @param {string} code - Código único del error.
     * @param {string} message - Descripción del error.
     * @param {number} [statusCode=502] - Código HTTP (opcional).
     * @param {Error} [cause] - Causa del error (opcional).
     */
    constructor(code, message, statusCode = 502, cause) {
        super({
            message,
            code,
            name: 'AdapterError',
            statusCode,
            cause,
        });
    }
}

module.exports = AdapterError;
