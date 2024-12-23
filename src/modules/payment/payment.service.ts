// src/modules/payment/payment.service.ts

import { Injectable } from '@nestjs/common';
import { PaymentRepository } from './repositories/payment.repository';
import { IPayment } from './interfaces/payment.interface';
import { CreatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
    constructor(private readonly paymentRepository: PaymentRepository) { }

    async createPayment(createPaymentDto: CreatePaymentDto): Promise<IPayment> {
        // Puedes mapear CreatePaymentDto a IPayment si hay diferencias
        // Aquí asumimos que son compatibles
        return this.paymentRepository.createPayment(createPaymentDto);
    }

    async getPayment(transactionId: string): Promise<IPayment | null> {
        return this.paymentRepository.getPayment(transactionId);
    }
}
