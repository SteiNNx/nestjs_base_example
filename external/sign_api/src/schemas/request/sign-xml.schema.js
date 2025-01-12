const { z } = require('zod');

// Esquema de validación para el cuerpo de la solicitud de enrolamiento
const signXmlSchema = z.object({
    transaction_id: z.string().min(1, "El campo transaction_id es requerido"),
});

// Exportar el esquema para su uso en otros módulos
module.exports = signXmlSchema;
