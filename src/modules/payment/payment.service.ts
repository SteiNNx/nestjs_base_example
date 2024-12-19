// src/modules/payment/payment.service.ts
import { Injectable } from '@nestjs/common';
import { PaymentRepository } from './repositories/payment.repository';
import { IPayment } from 'src/common/interfaces/payment.interface';

@Injectable()
export class PaymentService {
    constructor(private readonly paymentRepository: PaymentRepository) { }

    async createPayment(payment: IPayment): Promise<void> {
        await this.paymentRepository.createPayment(payment);
    }

    async getPayment(transactionId: string): Promise<IPayment | null> {
        return this.paymentRepository.getPayment(transactionId);
    }
}
