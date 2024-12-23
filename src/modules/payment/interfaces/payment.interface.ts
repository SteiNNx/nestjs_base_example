// src/modules/payment/interfaces/payment.interface.ts

export interface IMerchantLocation {
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
}

export interface IMerchant {
    merchant_id: string;
    name: string;
    category: string;
    location: IMerchantLocation;
}

export interface IIssuer {
    bank_id: string;
    name: string;
    country: string;
}

export interface IEmvData {
    application_id: string;
    application_label: string;
    transaction_counter: number;
    unpredictable_number: string;
    issuer_application_data: string;
}

export interface IAdditionalData {
    installments: number;
    tip_amount: number;
    cashback_amount: number;
}

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
}
