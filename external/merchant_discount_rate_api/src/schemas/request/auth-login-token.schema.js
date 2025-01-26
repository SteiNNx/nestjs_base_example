// src/schemas/request/auth-login-token.schema.js

const { z } = require('zod');

/**
 * Esquema de validación para el cuerpo de la solicitud de login.
 * 
 * Requerimos:
 *  - username: string no vacía
 *  - password: string no vacía
 */
const authLoginTokenSchema = z.object({
    username: z.string().min(1, "El campo 'username' es requerido"),
    password: z.string().min(1, "El campo 'password' es requerido"),
});

// Exportar el esquema para su uso en otros módulos
module.exports = authLoginTokenSchema;
