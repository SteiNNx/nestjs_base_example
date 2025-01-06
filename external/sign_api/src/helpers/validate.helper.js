const { ZodError } = require('zod');
const ValidationError = require('../exceptions/validation.exception');

/**
 * Valida el objeto de enrolamiento de comercio utilizando Zod.
 *
 * @param {Object} data - El objeto JSON a validar.
 * @throws {Error} - Lanza un Error con un mensaje personalizado si la validación falla.
 */
const validateBodySchema = (data, schema, operacion) => {
  try {
    // Parse/Valida con el esquema que recibe como parámetro
    schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      // Manejar errores de validación de Zod
      const errorMessages = error.errors.map(err => ({
        field: err.path.join('.'),   // Ruta del campo con error (p.ej. "body.email")
        message: err.message         // Mensaje de error "El campo es requerido"
      }));

      const validationThrowError = new ValidationError(
        operacion,                               // <= aquí puedes indicar la operación
        'Error de validación schema de entrada.', // mensaje general
        400,                                     // status HTTP
        error,                                   // causa (Error original de Zod)
        errorMessages                            // detalles de cada campo
      );

      throw validationThrowError;
    }
    throw error; // Lanza otros tipos de error (no Zod)
  }
}

module.exports = validateBodySchema;
