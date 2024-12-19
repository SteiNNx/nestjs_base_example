import { Module } from '@nestjs/common';
import { PaymentValidationPipe } from './pipes/payment-validation.pipe';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentController } from './payment.controller';

@Module({
    providers: [PaymentValidationPipe, PaymentRepository],
    controllers: [PaymentController],
    exports: [PaymentValidationPipe, PaymentRepository],
})
export class PaymentModule { }
