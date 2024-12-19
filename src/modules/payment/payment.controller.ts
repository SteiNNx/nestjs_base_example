import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { PaymentValidationPipe } from './pipes/payment-validation.pipe';
import { PaymentRepository } from './repositories/payment.repository';
import { IPayment } from 'src/common/interfaces/payment.interface';

@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentRepository: PaymentRepository) { }

    @Post()
    @UsePipes(PaymentValidationPipe)
    async createPayment(@Body() payment: IPayment): Promise<void> {
        await this.paymentRepository.createPayment(payment);
    }
}
