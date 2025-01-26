// src/schemas/request/auth-validate-token.schema.js

const { z } = require('zod');

/**
 * Esquema de validación para el cuerpo de la solicitud de validate.
 * 
 * Requerimos:
 *  - token: string no vacía
 */
const authValidateTokenSchema = z.object({
    token: z.string().min(1, "El campo 'token' es requerido"),
});

// Exportar el esquema para su uso en otros módulos
module.exports = authValidateTokenSchema;
