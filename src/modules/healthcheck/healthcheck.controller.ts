// src/modules/healthcheck.controller.ts
import { Controller, Get, HttpCode } from '@nestjs/common';

import { HeadersMetadata } from 'src/common/decorators/headers-metadata.decorator';

@Controller('healthcheck')
export class HealthcheckController {
    @Get()
    @HttpCode(200)
    @HeadersMetadata({
        funcionalidad: 'endpoints.healthcheck.funcionalidad',
        etapa: 'endpoints.healthcheck.etapa',
        operacion: 'endpoints.healthcheck.operacion',
    })
    healthcheck(): string {
        return 'OK';
    }
}
