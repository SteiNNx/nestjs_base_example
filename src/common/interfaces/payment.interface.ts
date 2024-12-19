// src/common/interfaces/payment.interface.ts
import { IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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

// Clases para validación con class-validator
class MerchantLocationDto implements IMerchantLocation {
    @IsString()
    address: string;

    @IsString()
    city: string;

    @IsString()
    country: string;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;
}

class MerchantDto implements IMerchant {
    @IsString()
    merchant_id: string;

    @IsString()
    name: string;

    @IsString()
    category: string;

    @ValidateNested()
    @Type(() => MerchantLocationDto)
    location: IMerchantLocation;
}

class IssuerDto implements IIssuer {
    @IsString()
    bank_id: string;

    @IsString()
    name: string;

    @IsString()
    country: string;
}

class EmvDataDto implements IEmvData {
    @IsString()
    application_id: string;

    @IsString()
    application_label: string;

    @IsNumber()
    transaction_counter: number;

    @IsString()
    unpredictable_number: string;

    @IsString()
    issuer_application_data: string;
}

class AdditionalDataDto implements IAdditionalData {
    @IsNumber()
    installments: number;

    @IsNumber()
    tip_amount: number;

    @IsNumber()
    cashback_amount: number;
}

export class Payment implements IPayment {
    @IsString()
    transaction_id?: string;

    @IsString()
    card_number: string;

    @IsNumber()
    amount: number;

    @IsString()
    currency: string;

    @IsString()
    timestamp: string;

    @ValidateNested()
    @Type(() => MerchantDto)
    merchant: IMerchant;

    @IsString()
    transaction_type: string;

    @IsString()
    auth_code: string;

    @IsString()
    response_code: string;

    @IsString()
    terminal_id: string;

    @ValidateNested()
    @Type(() => IssuerDto)
    issuer: IIssuer;

    @IsString()
    cardholder_verification_method: string;

    @ValidateNested()
    @Type(() => EmvDataDto)
    emv_data: IEmvData;

    @ValidateNested()
    @Type(() => AdditionalDataDto)
    additional_data: IAdditionalData;
}
