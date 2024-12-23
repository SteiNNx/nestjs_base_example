import {
    IsString,
    IsNumber,
    Min,
    IsOptional,
    ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para la ubicación del comerciante.
 */
export class MerchantLocationDto {
    @ApiProperty({ description: 'Dirección del comerciante' })
    @IsString()
    address: string;

    @ApiProperty({ description: 'Ciudad del comerciante' })
    @IsString()
    city: string;

    @ApiProperty({ description: 'País del comerciante' })
    @IsString()
    country: string;

    @ApiProperty({ description: 'Latitud de la ubicación del comerciante' })
    @IsNumber()
    latitude: number;

    @ApiProperty({ description: 'Longitud de la ubicación del comerciante' })
    @IsNumber()
    longitude: number;
}

/**
 * DTO para la información del comerciante.
 */
export class MerchantDto {
    @ApiProperty({ description: 'ID del comerciante' })
    @IsString()
    merchant_id: string;

    @ApiProperty({ description: 'Nombre del comerciante' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Categoría del comerciante' })
    @IsString()
    category: string;

    @ApiProperty({ type: MerchantLocationDto, description: 'Ubicación del comerciante' })
    @ValidateNested()
    @Type(() => MerchantLocationDto)
    location: MerchantLocationDto;
}

/**
 * DTO para la información del emisor de la tarjeta.
 */
export class IssuerDto {
    @ApiProperty({ description: 'ID del banco emisor' })
    @IsString()
    bank_id: string;

    @ApiProperty({ description: 'Nombre del banco emisor' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'País del banco emisor' })
    @IsString()
    country: string;
}

/**
 * DTO para los datos EMV de la transacción.
 */
export class EmvDataDto {
    @ApiProperty({ description: 'ID de la aplicación EMV' })
    @IsString()
    application_id: string;

    @ApiProperty({ description: 'Etiqueta de la aplicación EMV' })
    @IsString()
    application_label: string;

    @ApiProperty({ description: 'Contador de transacciones EMV' })
    @IsNumber()
    transaction_counter: number;

    @ApiProperty({ description: 'Número impredecible EMV' })
    @IsString()
    unpredictable_number: string;

    @ApiProperty({ description: 'Datos de la aplicación del emisor EMV' })
    @IsString()
    issuer_application_data: string;
}

/**
 * DTO para datos adicionales de la transacción.
 */
export class AdditionalDataDto {
    @ApiProperty({ description: 'Número de cuotas' })
    @IsNumber()
    installments: number;

    @ApiProperty({ description: 'Monto de la propina' })
    @IsNumber()
    tip_amount: number;

    @ApiProperty({ description: 'Monto del cashback' })
    @IsNumber()
    cashback_amount: number;
}

/**
 * DTO principal para la creación de un pago.
 */
export class CreatePaymentDto {
    @ApiPropertyOptional({ description: 'ID de la transacción', example: 'txn_12345' })
    @IsOptional()
    @IsString()
    transaction_id?: string;

    @ApiProperty({ description: 'Número de la tarjeta de crédito', example: '4111111111111111' })
    @IsString()
    card_number: string;

    @ApiProperty({ description: 'Monto del pago', example: 100.50 })
    @IsNumber()
    @Min(0)
    amount: number;

    @ApiProperty({ description: 'Moneda del pago', example: 'USD' })
    @IsString()
    currency: string;

    @ApiProperty({ description: 'Marca de tiempo del pago', example: '2024-04-23T18:25:43.511Z' })
    @IsString()
    timestamp: string;

    @ApiProperty({ type: MerchantDto, description: 'Información del comerciante' })
    @ValidateNested()
    @Type(() => MerchantDto)
    merchant: MerchantDto;

    @ApiProperty({ description: 'Tipo de transacción', example: 'purchase' })
    @IsString()
    transaction_type: string;

    @ApiProperty({ description: 'Código de autorización', example: 'AUTH123' })
    @IsString()
    auth_code: string;

    @ApiProperty({ description: 'Código de respuesta', example: '00' })
    @IsString()
    response_code: string;

    @ApiProperty({ description: 'ID del terminal', example: 'terminal_001' })
    @IsString()
    terminal_id: string;

    @ApiProperty({ type: IssuerDto, description: 'Información del emisor de la tarjeta' })
    @ValidateNested()
    @Type(() => IssuerDto)
    issuer: IssuerDto;

    @ApiProperty({ description: 'Método de verificación del titular de la tarjeta', example: 'PIN' })
    @IsString()
    cardholder_verification_method: string;

    @ApiProperty({ type: EmvDataDto, description: 'Datos EMV de la transacción' })
    @ValidateNested()
    @Type(() => EmvDataDto)
    emv_data: EmvDataDto;

    @ApiProperty({ type: AdditionalDataDto, description: 'Datos adicionales de la transacción' })
    @ValidateNested()
    @Type(() => AdditionalDataDto)
    additional_data: AdditionalDataDto;
}
