// src/core/core.module.ts

import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { HttpClientService } from './http-client.service';
import { MonitoreoService } from './monitoreo.service';
import { LoggerService } from './logger.service';

@Global()
@Module({
  imports: [
    HttpModule,       // Importa HttpModule para usar HttpService en HttpClientService
    ConfigModule,     // Importa ConfigModule para usar ConfigService en HttpClientService
  ],
  providers: [
    LoggerService,
    MonitoreoService,
    HttpClientService, // Agrega HttpClientService como proveedor
  ],
  exports: [
    LoggerService,
    MonitoreoService,
    HttpClientService, // Exporta HttpClientService para que esté disponible en otros módulos
  ],
})
export class CoreModule {}
