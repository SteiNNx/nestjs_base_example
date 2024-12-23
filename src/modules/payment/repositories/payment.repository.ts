// src/modules/payment/repositories/payment.repository.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DynamoDBService } from 'src/common/db/dynamodb.client';
import { IPayment } from '../interfaces/payment.interface';
import { CreatePaymentDto } from '../dto/payment.dto';

@Injectable()
export class PaymentRepository {
    private readonly logger = new Logger(PaymentRepository.name);
    private readonly tableName: string;

    constructor(
        private readonly dynamoDBService: DynamoDBService,
        private readonly configService: ConfigService,
    ) {
        // Obtenemos el nombre de la tabla 'payments' desde la configuración
        this.tableName = this.configService.get<string>('dynamoDB.tables.payments') || 'payments';
    }

    /**
     * Crea un nuevo pago en la base de datos DynamoDB.
     * @param payment El pago a crear.
     * @returns El pago creado.
     */
    async createPayment(payment: CreatePaymentDto): Promise<IPayment> {
        const item = {
            transaction_id: { S: payment.transaction_id || '' },
            card_number: { S: payment.card_number },
            amount: { N: payment.amount.toString() },
            currency: { S: payment.currency },
            timestamp: { S: payment.timestamp },
            merchant: {
                M: {
                    merchant_id: { S: payment.merchant.merchant_id },
                    name: { S: payment.merchant.name },
                    category: { S: payment.merchant.category },
                    location: {
                        M: {
                            address: { S: payment.merchant.location.address },
                            city: { S: payment.merchant.location.city },
                            country: { S: payment.merchant.location.country },
                            latitude: { N: payment.merchant.location.latitude.toString() },
                            longitude: { N: payment.merchant.location.longitude.toString() },
                        },
                    },
                },
            },
            transaction_type: { S: payment.transaction_type },
            auth_code: { S: payment.auth_code },
            response_code: { S: payment.response_code },
            terminal_id: { S: payment.terminal_id },
            issuer: {
                M: {
                    bank_id: { S: payment.issuer.bank_id },
                    name: { S: payment.issuer.name },
                    country: { S: payment.issuer.country },
                },
            },
            cardholder_verification_method: { S: payment.cardholder_verification_method },
            emv_data: {
                M: {
                    application_id: { S: payment.emv_data.application_id },
                    application_label: { S: payment.emv_data.application_label },
                    transaction_counter: { N: payment.emv_data.transaction_counter.toString() },
                    unpredictable_number: { S: payment.emv_data.unpredictable_number },
                    issuer_application_data: { S: payment.emv_data.issuer_application_data },
                },
            },
            additional_data: {
                M: {
                    installments: { N: payment.additional_data.installments.toString() },
                    tip_amount: { N: payment.additional_data.tip_amount.toString() },
                    cashback_amount: { N: payment.additional_data.cashback_amount.toString() },
                },
            },
        };

        const success = await this.dynamoDBService.putItem(this.tableName, item);
        if (!success) {
            this.logger.error(`No se pudo crear el pago con transaction_id: ${payment.transaction_id}`);
            throw new Error('Failed to create payment');
        }

        // Retornar el objeto IPayment recién creado
        const createdPayment: IPayment = {
            ...payment,
        };

        return createdPayment;
    }

    /**
     * Obtiene un pago por su transaction_id desde la base de datos DynamoDB.
     * @param transactionId El ID de la transacción a obtener.
     * @returns El pago si existe, de lo contrario null.
     */
    async getPayment(transactionId: string): Promise<IPayment | null> {
        const key = { transaction_id: { S: transactionId } };
        const item = await this.dynamoDBService.getItem(this.tableName, key);
        return item ? this.mapDynamoDBItemToPayment(item) : null;
    }

    private mapDynamoDBItemToPayment(item: Record<string, any>): IPayment {
        return {
            transaction_id: item.transaction_id.S || undefined,
            card_number: item.card_number.S,
            amount: parseFloat(item.amount.N),
            currency: item.currency.S,
            timestamp: item.timestamp.S,
            merchant: {
                merchant_id: item.merchant.M.merchant_id.S,
                name: item.merchant.M.name.S,
                category: item.merchant.M.category.S,
                location: {
                    address: item.merchant.M.location.M.address.S,
                    city: item.merchant.M.location.M.city.S,
                    country: item.merchant.M.location.M.country.S,
                    latitude: parseFloat(item.merchant.M.location.M.latitude.N),
                    longitude: parseFloat(item.merchant.M.location.M.longitude.N),
                },
            },
            transaction_type: item.transaction_type.S,
            auth_code: item.auth_code.S,
            response_code: item.response_code.S,
            terminal_id: item.terminal_id.S,
            issuer: {
                bank_id: item.issuer.M.bank_id.S,
                name: item.issuer.M.name.S,
                country: item.issuer.M.country.S,
            },
            cardholder_verification_method: item.cardholder_verification_method.S,
            emv_data: {
                application_id: item.emv_data.M.application_id.S,
                application_label: item.emv_data.M.application_label.S,
                transaction_counter: parseInt(item.emv_data.M.transaction_counter.N, 10),
                unpredictable_number: item.emv_data.M.unpredictable_number.S,
                issuer_application_data: item.emv_data.M.issuer_application_data.S,
            },
            additional_data: {
                installments: parseInt(item.additional_data.M.installments.N, 10),
                tip_amount: parseFloat(item.additional_data.M.tip_amount.N),
                cashback_amount: parseFloat(item.additional_data.M.cashback_amount.N),
            },
        };
    }
}
