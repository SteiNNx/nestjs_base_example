// src/schemas/request/add-payment-mdr-applied.schema.js

/**
 * @file add-payment-mdr-applied.schema.js
 * @description Esquema de validación Zod para la creación de un registro de pago (payment_mdr_applied).
 * 
 * Este esquema valida los campos requeridos en el JSON final. Cada uno de los campos está descrito en detalle a continuación.
 * 
 * ## Campos Principales:
 * 
 * ### transaction_id
 * - Tipo: `string`
 * - Descripción: Identificador único de la transacción.
 * 
 * ### timestamp
 * - Tipo: `string` (formato ISO 8601 en hora UTC)
 * - Descripción: Momento en que se efectúa la transacción (hora UTC).
 * 
 * ### timestamp_local
 * - Tipo: `string` (formato ISO 8601 con offset, ej. `2025-01-10T09:30:00-03:00`)
 * - Descripción: Momento local en el que se efectúa la transacción, con zona horaria u offset incluido.
 * 
 * ### channel
 * - Tipo: `string`
 * - Descripción: Canal o plataforma de la transacción.
 *   - Posibles valores de ejemplo: `"SmartPOS"`, `"Integrated-SmartPOS"`, `"WebEcommerce"`, `"MobileApp"`, `"POS"`.
 * 
 * ### mcc
 * - Tipo: `string`
 * - Descripción: Merchant Category Code, un código de 4 dígitos que describe la actividad comercial del negocio.
 * 
 * ### card_type
 * - Tipo: `string`
 * - Descripción: Tipo de tarjeta utilizada en la transacción.
 *   - Posibles valores de ejemplo: `"Crédito"`, `"Débito"`, `"Prepago"`, `"Empresarial"`.
 * 
 * ### card_brand
 * - Tipo: `string`
 * - Descripción: Marca de la tarjeta.
 *   - Posibles valores de ejemplo: `"VISA"`, `"MasterCard"`, `"American Express"`, `"Diners"`, `"UnionPay"`.
 * 
 * ### card_type_national_international
 * - Tipo: `string`
 * - Descripción: Indica si la tarjeta es de uso nacional o internacional.
 *   - Posibles valores de ejemplo: `"Nacional"`, `"Internacional"`.
 * 
 * ### card_number
 * - Tipo: `string`
 * - Descripción: Número de la tarjeta enmascarado (masked).
 *   - Ejemplo: `"411111******1234"`
 * 
 * ### amount
 * - Tipo: `number`
 * - Descripción: Monto de la transacción en la moneda especificada.
 * 
 * ### currency
 * - Tipo: `string`
 * - Descripción: Tipo de moneda (ej. `"CLP"`, `"USD"`).
 * 
 * ### transaction_type
 * - Tipo: `string`
 * - Descripción: Tipo de transacción.
 *   - Posibles valores de ejemplo: `"Pago"`, `"Anulado"`, `"Reversado"`, `"Devolución"`, `"Anulado_Reversa"`.
 * 
 * ### auth_code
 * - Tipo: `string`
 * - Descripción: Código de autorización provisto para la transacción.
 * 
 * ### response_code
 * - Tipo: `string`
 * - Descripción: Código de respuesta de la transacción (ej. `"00"` para aprobación).
 * 
 * ### terminal_id
 * - Tipo: `string`
 * - Descripción: Identificador del terminal que procesó la transacción.
 * 
 * ### merchant_id
 * - Tipo: `string`
 * - Descripción: Identificador único del comercio a nivel raíz, usado para indexación o búsquedas.
 * 
 * 
 * ## Objeto `merchant`
 * - Contiene la información del comercio.
 * 
 * ### merchant.merchant_id
 * - Tipo: `string`
 * - Descripción: Identificador del comercio (debe coincidir con `merchant_id` a nivel raíz).
 * 
 * ### merchant.name
 * - Tipo: `string`
 * - Descripción: Nombre o razón social del comercio.
 * 
 * ### merchant.category
 * - Tipo: `string`
 * - Descripción: Rubro o categoría del comercio.
 * 
 * ### merchant.location
 * - Tipo: `object`
 * - Descripción: Información de ubicación del comercio.
 *   - **address** (`string`): Dirección física.  
 *   - **city** (`string`): Ciudad.  
 *   - **country** (`string`): País.  
 *   - **latitude** (`number`): Latitud.  
 *   - **longitude** (`number`): Longitud.
 * 
 * 
 * ## Objeto `issuer`
 * - Contiene los datos del banco emisor.
 * 
 * ### issuer.bank_id
 * - Tipo: `string`
 * - Descripción: Identificador único del banco emisor.
 * 
 * ### issuer.name
 * - Tipo: `string`
 * - Descripción: Nombre del banco emisor.
 * 
 * ### issuer.country
 * - Tipo: `string`
 * - Descripción: País del banco emisor.
 * 
 * 
 * ## Objeto `card_details`
 * - Contiene información específica de la tarjeta.
 * 
 * ### card_details.masked_number
 * - Tipo: `string`
 * - Descripción: Número de tarjeta enmascarado.
 * 
 * ### card_details.payment_method
 * - Tipo: `string`
 * - Descripción: Método de pago (ej. `"Chip"`, `"Swipe"`, `"Contactless"`).
 * 
 * ### card_details.chip_type
 * - Tipo: `string`
 * - Descripción: Indica si la tarjeta tiene chip EMV o banda magnética.
 * 
 * ### card_details.entry_mode
 * - Tipo: `string`
 * - Descripción: Modo de ingreso de la tarjeta (ej. `"Chip"`, `"Contactless"`).
 * 
 * ### card_details.pinpad_used
 * - Tipo: `boolean`
 * - Descripción: Indica si se usó pinpad para la transacción.
 * 
 * ### card_details.signature_method
 * - Tipo: `string`
 * - Descripción: Método de firma, puede ser `"Firma"` o `"N/A"` si no aplica.
 * 
 * ### card_details.installments
 * - Tipo: `number`
 * - Descripción: Número de cuotas, si aplica.
 * 
 * ### card_details.network
 * - Tipo: `string`
 * - Descripción: Red de la tarjeta (coincide con `card_brand` o similar).
 * 
 * ### card_details.expiry_date
 * - Tipo: `string`
 * - Descripción: Fecha de expiración con formato `"YYYY-MM"`.
 * 
 * 
 * ## Objeto `emv_data`
 * - Contiene datos EMV relevantes.
 * 
 * ### emv_data.application_id
 * - Tipo: `string`
 * - Descripción: Identificador de la aplicación EMV.
 * 
 * ### emv_data.application_label
 * - Tipo: `string`
 * - Descripción: Etiqueta de la aplicación EMV (ej. `"VISA DEBITO"`, `"MASTERCARD DEBITO"`).
 * 
 * ### emv_data.transaction_counter
 * - Tipo: `number`
 * - Descripción: Contador de transacciones EMV.
 * 
 * ### emv_data.unpredictable_number
 * - Tipo: `string`
 * - Descripción: Número impredecible EMV.
 * 
 * ### emv_data.issuer_application_data
 * - Tipo: `string`
 * - Descripción: Datos de la aplicación del emisor (IAD).
 * 
 * 
 * ## Objeto `additional_data`
 * - Contiene información adicional.
 * 
 * ### additional_data.installments
 * - Tipo: `number`
 * - Descripción: Número de cuotas.
 * 
 * ### additional_data.tip_amount
 * - Tipo: `number`
 * - Descripción: Monto de propina.
 * 
 * ### additional_data.cashback_amount
 * - Tipo: `number`
 * - Descripción: Monto de cashback, si aplica.
 */

const { z } = require('zod');

const addPaymentMdrAppliedSchema = z.object({

    // Campos principales
    transaction_id: z.string().min(1, "El campo 'transaction_id' es requerido"),
    timestamp: z.string().min(1, "El campo 'timestamp' es requerido"),
    timestamp_local: z.string().min(1, "El campo 'timestamp_local' es requerido"),
    channel: z.string().min(1, "El campo 'channel' es requerido"),
    mcc: z.string().min(1, "El campo 'mcc' es requerido"),
    card_type: z.string().min(1, "El campo 'card_type' es requerido"),
    card_brand: z.string().min(1, "El campo 'card_brand' es requerido"),
    card_type_national_international: z.string().min(1, "El campo 'card_type_national_international' es requerido"),
    card_number: z.string().min(1, "El campo 'card_number' es requerido"),
    amount: z.number({ required_error: "El campo 'amount' es requerido" }),
    currency: z.string().min(1, "El campo 'currency' es requerido"),
    transaction_type: z.string().min(1, "El campo 'transaction_type' es requerido"),
    auth_code: z.string().min(1, "El campo 'auth_code' es requerido"),
    response_code: z.string().min(1, "El campo 'response_code' es requerido"),
    terminal_id: z.string().min(1, "El campo 'terminal_id' es requerido"),

    // merchant_id a nivel raíz
    merchant_id: z.string().min(1, "El campo 'merchant_id' es requerido"),

    // Objeto merchant
    merchant: z.object({
        merchant_id: z.string().min(1, "El campo 'merchant_id' en 'merchant' es requerido"),
        name: z.string().min(1, "El campo 'name' en 'merchant' es requerido"),
        category: z.string().min(1, "El campo 'category' en 'merchant' es requerido"),
        location: z.object({
            address: z.string().min(1, "El campo 'address' en 'merchant.location' es requerido"),
            city: z.string().min(1, "El campo 'city' en 'merchant.location' es requerido"),
            country: z.string().min(1, "El campo 'country' en 'merchant.location' es requerido"),
            latitude: z.number({ required_error: "El campo 'latitude' en 'merchant.location' es requerido" }),
            longitude: z.number({ required_error: "El campo 'longitude' en 'merchant.location' es requerido" })
        })
    }),

    // Objeto issuer
    issuer: z.object({
        bank_id: z.string().min(1, "El campo 'bank_id' en 'issuer' es requerido"),
        name: z.string().min(1, "El campo 'name' en 'issuer' es requerido"),
        country: z.string().min(1, "El campo 'country' en 'issuer' es requerido")
    }),

    // Objeto card_details
    card_details: z.object({
        masked_number: z.string().min(1, "El campo 'masked_number' en 'card_details' es requerido"),
        payment_method: z.string().min(1, "El campo 'payment_method' en 'card_details' es requerido"),
        chip_type: z.string().min(1, "El campo 'chip_type' en 'card_details' es requerido"),
        entry_mode: z.string().min(1, "El campo 'entry_mode' en 'card_details' es requerido"),
        pinpad_used: z.boolean({ required_error: "El campo 'pinpad_used' en 'card_details' es requerido" }),
        signature_method: z.string().min(1, "El campo 'signature_method' en 'card_details' es requerido"),
        installments: z.number({ required_error: "El campo 'installments' en 'card_details' es requerido" }),
        network: z.string().min(1, "El campo 'network' en 'card_details' es requerido"),
        expiry_date: z.string().min(1, "El campo 'expiry_date' en 'card_details' es requerido")
    }),

    // Objeto emv_data
    emv_data: z.object({
        application_id: z.string().min(1, "El campo 'application_id' en 'emv_data' es requerido"),
        application_label: z.string().min(1, "El campo 'application_label' en 'emv_data' es requerido"),
        transaction_counter: z.number({ required_error: "El campo 'transaction_counter' en 'emv_data' es requerido" }),
        unpredictable_number: z.string().min(1, "El campo 'unpredictable_number' en 'emv_data' es requerido"),
        issuer_application_data: z.string().min(1, "El campo 'issuer_application_data' en 'emv_data' es requerido")
    }),

    // Objeto additional_data
    additional_data: z.object({
        installments: z.number({ required_error: "El campo 'installments' en 'additional_data' es requerido" }),
        tip_amount: z.number({ required_error: "El campo 'tip_amount' en 'additional_data' es requerido" }),
        cashback_amount: z.number({ required_error: "El campo 'cashback_amount' en 'additional_data' es requerido" })
    })
});

module.exports = addPaymentMdrAppliedSchema;
