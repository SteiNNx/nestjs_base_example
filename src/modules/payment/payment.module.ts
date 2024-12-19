// src/modules/payment/payment.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentValidationPipe } from './pipes/payment-validation.pipe';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { DynamoDBService } from 'src/common/db/dynamodb.client';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true })
    ],
    providers: [
        DynamoDBService,
        PaymentValidationPipe,
        PaymentRepository,
        PaymentService,
    ],
    controllers: [
        PaymentController
    ],
    exports: [
        DynamoDBService,
        PaymentValidationPipe,
        PaymentRepository,
        PaymentService,
    ],
})
export class PaymentModule { }
