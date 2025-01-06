/**
 * Clase base para implementar errores personalizados.
 * Extiende la clase nativa `Error` de JavaScript y permite añadir propiedades
 * personalizadas como códigos de error, estados HTTP, causas de error, y errores relacionados.
 *
 * Esta clase está diseñada para proporcionar una base sólida para manejar errores
 * de manera estructurada y ofrecer información útil para depuración y manejo de excepciones.
 *
 * @class BaseError
 * @extends {Error}
 * @param {Object} options - Opciones para configurar el error.
 * @param {string} options.message - Mensaje descriptivo que explica el error.
 * @param {string} options.code - Código único que identifica el error.
 * @param {string} [options.name='BaseError'] - Nombre del error (opcional, por defecto: 'BaseError').
 * @param {number} [options.statusCode=500] - Código HTTP asociado al error (opcional, por defecto: 500).
 * @param {Error} [options.cause] - Error original que causó este error (opcional).
 * @param {Array<Object>} [options.errors=[]] - Lista de errores adicionales relacionados (opcional).
 *
 * @example
 * // Ejemplo de uso con todos los parámetros
 * const baseError = new BaseError({
 *   message: 'Error al procesar la solicitud.',
 *   code: 'BASE.001',
 *   name: 'CustomBaseError',
 *   statusCode: 400,
 *   cause: new Error('Error original'),
 *   errors: [
 *     { field: 'nombre', message: 'El nombre es obligatorio.' },
 *     { field: 'email', message: 'El correo no tiene un formato válido.' }
 *   ]
 * });
 * throw baseError;
 *
 * @example
 * // Ejemplo de uso básico
 * const simpleError = new BaseError({
 *   message: 'Ha ocurrido un error simple.',
 *   code: 'SIMPLE.001'
 * });
 * throw simpleError;
 */
class BaseError extends Error {
    /**
     * Constructor de la clase BaseError.
     *
     * @param {Object} options - Parámetros de configuración del error.
     */
    constructor({ message, code, name, statusCode, cause, errors = [] }) {
        super(message); // Llama al constructor de la clase `Error` con el mensaje.

        this.code = code; // Código único que identifica el tipo de error.
        this.name = name || 'BaseError'; // Nombre del error, por defecto es 'BaseError'.
        this.statusCode = statusCode || 500; // Código HTTP asociado, por defecto 500.
        this.errors = errors; // Lista de errores adicionales relacionados, útil para validaciones.

        // Manejo de la causa original del error.
        this.cause = {
            code: (cause && cause.code) || '', // Código de la causa, si está disponible.
            name: (cause && cause.name) || '', // Nombre del error original, si existe.
            message: (cause && cause.message) || '', // Mensaje descriptivo del error original.
            stack: (cause && cause.stack) || '' // Stack trace del error original.
        };        

        // Si existe una causa y es una instancia de `Error`, concatenar el stack trace.
        if (cause instanceof Error) {
            this.stack += `\nCaused by: ${cause.stack}`; // Añade información de la causa al stack trace.
        }
    }
}

module.exports = BaseError;
