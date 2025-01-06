/**
 * Clase que representa un mensaje de salida para las respuestas de la API.
 * Esta clase se utiliza para estructurar de forma consistente las respuestas exitosas
 * o informativas que se devuelven desde la API, proporcionando un formato uniforme.
 * 
 * @class OutputMessageSuccess
 * 
 * @example
 * // Ejemplo de uso para enviar una respuesta exitosa
 * const successResponse = new OutputMessageSuccess(
 *   200,
 *   'OK',
 *   { userId: 123, name: 'John Doe' }
 * );
 * 
 * console.log(successResponse);
 * // Salida esperada:
 * // OutputMessageSuccess {
 * //   statusCode: 200,
 * //   code: '0000'
 * //   message: 'OK',
 * //   data: { userId: 123, name: 'John Doe' }
 * // }
 */
class OutputMessageSuccess {
    /**
     * Crea una nueva instancia de OutputMessageSuccess.
     * 
     * @constructor
     * @param {number} statusCode - Código de estado HTTP (e.g., 200, 201).
     * @param {string} code - Un código único para Monitoreo (e.g., 'ESA.XXX.XXX').
     * @param {string} message - Mensaje descriptivo para el usuario final.
     * @param {Object|null} [data=null] - Datos opcionales relacionados con la respuesta.
     */
    constructor(statusCode, code, message, data = null) {
        this.statusCode = statusCode;
        this.code = code;
        this.message = message;
        this.data = data;
    }
}

module.exports = OutputMessageSuccess;
