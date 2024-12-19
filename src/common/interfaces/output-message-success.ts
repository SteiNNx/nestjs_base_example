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
 *   '0000',
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

export class OutputMessageSuccess<T = any> {
    /**
     * Crea una nueva instancia de OutputMessageSuccess.
     * 
     * @constructor
     * @param {number} statusCode - Código de estado HTTP (e.g., 200, 201).
     * @param {string} code - Un código único para Monitoreo (e.g., '0000').
     * @param {string} message - Mensaje descriptivo para el usuario final.
     * @param {T|null} [data=null] - Datos opcionales relacionados con la respuesta.
     */
    constructor(
        public readonly statusCode: number,
        public readonly code: string,
        public readonly message: string,
        public readonly data: T | null = null
    ) { }
}
