// src/core/core.module.ts
import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { MonitoreoService } from './monitoreo.service';

@Global()
@Module({
  providers: [
    LoggerService,
    MonitoreoService,
  ],
  exports: [
    LoggerService,
    MonitoreoService,
  ],
})
export class CoreModule { }
