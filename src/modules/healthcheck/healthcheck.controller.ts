import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';

import { ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

import { HeadersMetadata } from 'src/common/decorators/headers-metadata.decorator';

/**
 * Controlador encargado de manejar las solicitudes de healthcheck de la aplicación.
 */
@ApiTags('healthcheck')
@Controller('healthcheck')
export class HealthcheckController {
    /**
     * Endpoint para verificar el estado de salud de la aplicación.
     * Retorna una respuesta simple indicando que el servicio está operativo.
     *
     * @returns Cadena de texto 'OK' indicando que el servicio está funcionando correctamente.
     */
    @Get()
    @HttpCode(HttpStatus.OK)
    @HeadersMetadata({
        funcionalidad: 'endpoints.healthcheck.funcionalidad',
        etapa: 'endpoints.healthcheck.etapa',
        operacion: 'endpoints.healthcheck.operacion',
    })
    @ApiOperation({ summary: 'Verificar el estado de salud de la aplicación' })
    @ApiOkResponse({
        description: 'La aplicación está funcionando correctamente',
        schema: {
            type: 'string',
            example: 'OK',
        },
    })
    healthcheck(): string {
        return 'OK';
    }
}
