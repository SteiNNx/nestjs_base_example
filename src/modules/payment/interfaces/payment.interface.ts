/**
 * Interfaz que representa la ubicación del comerciante.
 */
export interface IMerchantLocation {
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
}

/**
 * Interfaz que representa la información del comerciante.
 */
export interface IMerchant {
    merchant_id: string;
    name: string;
    category: string;
    location: IMerchantLocation;
}

/**
 * Interfaz que representa la información del emisor de la tarjeta.
 */
export interface IIssuer {
    bank_id: string;
    name: string;
    country: string;
}

/**
 * Interfaz que representa los datos EMV asociados a una transacción.
 */
export interface IEmvData {
    application_id: string;
    application_label: string;
    transaction_counter: number;
    unpredictable_number: string;
    issuer_application_data: string;
}

/**
 * Interfaz que representa datos adicionales de la transacción.
 */
export interface IAdditionalData {
    installments: number;
    tip_amount: number;
    cashback_amount: number;
}

/**
 * Interfaz que representa un pago.
 */
export interface IPayment {
    transaction_id?: string;
    card_number: string;
    amount: number;
    currency: string;
    timestamp: string;
    merchant: IMerchant;
    transaction_type: string;
    auth_code: string;
    response_code: string;
    terminal_id: string;
    issuer: IIssuer;
    cardholder_verification_method: string;
    emv_data: IEmvData;
    additional_data: IAdditionalData;
    status?: string;
    signed_data?: string; 
}
