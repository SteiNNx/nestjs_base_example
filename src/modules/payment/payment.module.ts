import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { DynamoDBService } from 'src/common/db/dynamodb.client';

import { HttpClientService } from 'src/core/http-client.service';
import { SignClient } from './clients/sign.client';
import { HttpModule } from '@nestjs/axios'; // Importar HttpModule

/**
 * Módulo encargado de la gestión de pagos.
 */
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        HttpModule, // Importar HttpModule para permitir solicitudes HTTP
    ],
    providers: [
        DynamoDBService,
        PaymentRepository,
        PaymentService,
        HttpClientService, // Registrar HttpClientService
        SignClient, // Registrar SignClient
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
