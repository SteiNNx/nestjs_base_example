// src/modules/payment/dto/create-payment.dto.ts

import {
    IsString,
    IsNumber,
    Min,
    IsOptional,
    ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

// DTOs para subentidades
export class MerchantLocationDto {
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

export class MerchantDto {
    @IsString()
    merchant_id: string;

    @IsString()
    name: string;

    @IsString()
    category: string;

    @ValidateNested()
    @Type(() => MerchantLocationDto)
    location: MerchantLocationDto;
}

export class IssuerDto {
    @IsString()
    bank_id: string;

    @IsString()
    name: string;

    @IsString()
    country: string;
}

export class EmvDataDto {
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

export class AdditionalDataDto {
    @IsNumber()
    installments: number;

    @IsNumber()
    tip_amount: number;

    @IsNumber()
    cashback_amount: number;
}

// DTO principal
export class CreatePaymentDto {
    @IsOptional()
    @IsString()
    transaction_id?: string;

    @IsString()
    card_number: string;

    @IsNumber()
    @Min(0)
    amount: number;

    @IsString()
    currency: string;

    @IsString()
    timestamp: string;

    @ValidateNested()
    @Type(() => MerchantDto)
    merchant: MerchantDto;

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
    issuer: IssuerDto;

    @IsString()
    cardholder_verification_method: string;

    @ValidateNested()
    @Type(() => EmvDataDto)
    emv_data: EmvDataDto;

    @ValidateNested()
    @Type(() => AdditionalDataDto)
    additional_data: AdditionalDataDto;
}
