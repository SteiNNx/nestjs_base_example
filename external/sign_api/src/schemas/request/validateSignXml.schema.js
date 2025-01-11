const { z } = require('zod');

// Esquema de validación para el cuerpo de la solicitud de enrolamiento
const validateSignXmlSchema = z.object({
    signedXml: z.string().min(1, "El campo signedXml es requerido"),
});

// Exportar el esquema para su uso en otros módulos
module.exports = validateSignXmlSchema;
