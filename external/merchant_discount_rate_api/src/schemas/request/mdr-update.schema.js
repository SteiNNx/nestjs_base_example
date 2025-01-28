// src/schemas/request/mdr-update.schema.js
const { z } = require('zod');

/**
 * Esquema de validación para actualizar tasas (MDR) sin incluir 'mcc'.
 * Cada campo es un número obligatorio.
 * Ajusta las validaciones según tus necesidades (p. ej., z.number().min(0))
 */
const mdrUpdateSchema = z.object({
    debito_nacional_presencial_smartpos_rate: z.number({
        required_error: "El campo 'debito_nacional_presencial_smartpos_rate' es requerido",
    }),
    debito_nacional_presencial_smartpos_uf: z.number({
        required_error: "El campo 'debito_nacional_presencial_smartpos_uf' es requerido",
    }),

    debito_nacional_integrado_presencial_rate: z.number({
        required_error: "El campo 'debito_nacional_integrado_presencial_rate' es requerido",
    }),
    debito_nacional_integrado_presencial_uf: z.number({
        required_error: "El campo 'debito_nacional_integrado_presencial_uf' es requerido",
    }),

    debito_nacional_ecommerce_online_rate: z.number({
        required_error: "El campo 'debito_nacional_ecommerce_online_rate' es requerido",
    }),
    debito_nacional_ecommerce_online_uf: z.number({
        required_error: "El campo 'debito_nacional_ecommerce_online_uf' es requerido",
    }),

    debito_internacional_presencial_smartpos_rate: z.number({
        required_error: "El campo 'debito_internacional_presencial_smartpos_rate' es requerido",
    }),
    debito_internacional_presencial_smartpos_uf: z.number({
        required_error: "El campo 'debito_internacional_presencial_smartpos_uf' es requerido",
    }),

    debito_internacional_integrado_presencial_rate: z.number({
        required_error: "El campo 'debito_internacional_integrado_presencial_rate' es requerido",
    }),
    debito_internacional_integrado_presencial_uf: z.number({
        required_error: "El campo 'debito_internacional_integrado_presencial_uf' es requerido",
    }),

    debito_internacional_ecommerce_online_rate: z.number({
        required_error: "El campo 'debito_internacional_ecommerce_online_rate' es requerido",
    }),
    debito_internacional_ecommerce_online_uf: z.number({
        required_error: "El campo 'debito_internacional_ecommerce_online_uf' es requerido",
    }),

    credito_nacional_presencial_smartpos_rate: z.number({
        required_error: "El campo 'credito_nacional_presencial_smartpos_rate' es requerido",
    }),
    credito_nacional_presencial_smartpos_uf: z.number({
        required_error: "El campo 'credito_nacional_presencial_smartpos_uf' es requerido",
    }),

    credito_nacional_integrado_presencial_rate: z.number({
        required_error: "El campo 'credito_nacional_integrado_presencial_rate' es requerido",
    }),
    credito_nacional_integrado_presencial_uf: z.number({
        required_error: "El campo 'credito_nacional_integrado_presencial_uf' es requerido",
    }),

    credito_nacional_ecommerce_online_rate: z.number({
        required_error: "El campo 'credito_nacional_ecommerce_online_rate' es requerido",
    }),
    credito_nacional_ecommerce_online_uf: z.number({
        required_error: "El campo 'credito_nacional_ecommerce_online_uf' es requerido",
    }),

    credito_internacional_presencial_smartpos_rate: z.number({
        required_error: "El campo 'credito_internacional_presencial_smartpos_rate' es requerido",
    }),
    credito_internacional_presencial_smartpos_uf: z.number({
        required_error: "El campo 'credito_internacional_presencial_smartpos_uf' es requerido",
    }),

    credito_internacional_integrado_presencial_rate: z.number({
        required_error: "El campo 'credito_internacional_integrado_presencial_rate' es requerido",
    }),
    credito_internacional_integrado_presencial_uf: z.number({
        required_error: "El campo 'credito_internacional_integrado_presencial_uf' es requerido",
    }),

    credito_internacional_ecommerce_online_rate: z.number({
        required_error: "El campo 'credito_internacional_ecommerce_online_rate' es requerido",
    }),
    credito_internacional_ecommerce_online_uf: z.number({
        required_error: "El campo 'credito_internacional_ecommerce_online_uf' es requerido",
    }),
});

// Exportar para su uso en tu controlador/módulo:
module.exports = mdrUpdateSchema;
