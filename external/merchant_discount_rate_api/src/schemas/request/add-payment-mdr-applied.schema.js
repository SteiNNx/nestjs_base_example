// src/schemas/request/add-payment-mdr-applied.schema.js

/**
 * @file add-payment-mdr-applied.schema.js
 * @description Esquema de validación Zod para la creación de un registro de pago (payment_mdr_applied).
 * 
 * Este esquema valida los campos requeridos para el proceso de aplicar MDR a un pago:
 * 
 * - transaction_id: Identificador único de la transacción.
 * - card_number: Número parcial/enmascarado de la tarjeta.
 * - amount: Monto total de la transacción.
 * - currency: Tipo de moneda.
 * - timestamp: Momento en que se efectúa la transacción.
 * - merchant: Objeto con los datos del comercio.
 *    - merchant_id: Identificador único del comercio.
 *    - name: Nombre o razón social del comercio.
 *    - category: Categoría del comercio.
 *    - location: Ubicación geográfica del comercio.
 *      - address: Dirección física del comercio.
 *      - city: Ciudad en la que se encuentra el comercio.
 *      - country: País en el que se encuentra el comercio.
 *      - latitude: Latitud de la ubicación.
 *      - longitude: Longitud de la ubicación.
 * - transaction_type: Tipo de transacción (ej. "Pago", "Devolución").
 * - auth_code: Código de autorización.
 * - response_code: Código de respuesta de la transacción.
 * - terminal_id: Identificador del terminal que procesó la transacción.
 * - issuer: Objeto con los datos del banco emisor.
 *    - bank_id: Identificador del banco emisor.
 *    - name: Nombre del banco emisor.
 *    - country: País del banco emisor.
 * - cardholder_verification_method: Método de verificación (ej. Firma, PIN).
 * - emv_data: Datos EMV relevantes.
 *    - application_id: Identificador de la aplicación EMV.
 *    - application_label: Etiqueta de la aplicación EMV.
 *    - transaction_counter: Contador de transacciones EMV.
 *    - unpredictable_number: Número impredecible EMV.
 *    - issuer_application_data: Datos de la aplicación del emisor.
 * - additional_data: Datos adicionales.
 *    - installments: Número de cuotas.
 *    - tip_amount: Monto de la propina.
 *    - cashback_amount: Monto de cashback, si aplica.
 */

const { z } = require('zod');

const addPaymentMdrAppliedSchema = z.object({
    transaction_id: z.string().min(1, "El campo 'transaction_id' es requerido"),
    card_number: z.string().min(1, "El campo 'card_number' es requerido"),
    amount: z.number({
        required_error: "El campo 'amount' es requerido"
    }),
    currency: z.string().min(1, "El campo 'currency' es requerido"),
    timestamp: z.string().min(1, "El campo 'timestamp' es requerido"),
    merchant: z.object({
        merchant_id: z.string().min(1, "El campo 'merchant_id' es requerido"),
        name: z.string().min(1, "El campo 'name' es requerido"),
        category: z.string().min(1, "El campo 'category' es requerido"),
        location: z.object({
            address: z.string().min(1, "El campo 'address' es requerido"),
            city: z.string().min(1, "El campo 'city' es requerido"),
            country: z.string().min(1, "El campo 'country' es requerido"),
            latitude: z.number({
                required_error: "El campo 'latitude' es requerido"
            }),
            longitude: z.number({
                required_error: "El campo 'longitude' es requerido"
            })
        })
    }),
    transaction_type: z.string().min(1, "El campo 'transaction_type' es requerido"),
    auth_code: z.string().min(1, "El campo 'auth_code' es requerido"),
    response_code: z.string().min(1, "El campo 'response_code' es requerido"),
    terminal_id: z.string().min(1, "El campo 'terminal_id' es requerido"),
    issuer: z.object({
        bank_id: z.string().min(1, "El campo 'bank_id' es requerido"),
        name: z.string().min(1, "El campo 'issuer.name' es requerido"),
        country: z.string().min(1, "El campo 'issuer.country' es requerido")
    }),
    cardholder_verification_method: z.string().min(1, "El campo 'cardholder_verification_method' es requerido"),
    emv_data: z.object({
        application_id: z.string().min(1, "El campo 'application_id' es requerido"),
        application_label: z.string().min(1, "El campo 'application_label' es requerido"),
        transaction_counter: z.number({
            required_error: "El campo 'transaction_counter' es requerido"
        }),
        unpredictable_number: z.string().min(1, "El campo 'unpredictable_number' es requerido"),
        issuer_application_data: z.string().min(1, "El campo 'issuer_application_data' es requerido")
    }),
    additional_data: z.object({
        installments: z.number({
            required_error: "El campo 'installments' es requerido"
        }),
        tip_amount: z.number({
            required_error: "El campo 'tip_amount' es requerido"
        }),
        cashback_amount: z.number({
            required_error: "El campo 'cashback_amount' es requerido"
        })
    })
});

module.exports = addPaymentMdrAppliedSchema;
