import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { DynamoDBService } from 'src/common/db/dynamodb.client';

/**
 * Módulo encargado de la gestión de pagos.
 */
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true })
    ],
    providers: [
        DynamoDBService,
        PaymentRepository,
        PaymentService,
    ],
    controllers: [
        PaymentController
    ],
    exports: [
        DynamoDBService,
        PaymentRepository,
        PaymentService,
    ],
})
export class PaymentModule { }
