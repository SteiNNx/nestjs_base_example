// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Reflector, APP_INTERCEPTOR } from '@nestjs/core';

import { AppConfiguration } from './config/app.config';
import { HeadersMetadataInterceptor } from './common/interceptors/headers-metada.interceptor';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';

import { CoreModule } from './core/core.module';
import { HealthcheckModule } from './modules/healthcheck/healthcheck.module';

import { LoggerService } from './core/logger.service';
import { MonitoreoService } from './core/monitoreo.service';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? undefined : '.env',
      load: [
        () => AppConfiguration.getConfig(),
      ],
    }),
    CoreModule,
    HealthcheckModule,
    PaymentModule,
  ],
  providers: [
    Reflector,
    LoggerService,
    MonitoreoService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HeadersMetadataInterceptor,
    },
  ],
})
export class AppModule { }
