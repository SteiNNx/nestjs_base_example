// src/common/interceptors/headers-metadata.interceptor.ts
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HeadersMetadataOptions } from '../decorators/headers-metadata.decorator';

@Injectable()
export class HeadersMetadataInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly configService: ConfigService,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // Obtener los metadatos del decorador
        const headersMetadata: HeadersMetadataOptions = this.reflector.get<HeadersMetadataOptions>(
            'headersMetadata',
            context.getHandler(),
        );

        return next.handle().pipe(
            tap(() => {
                const response = context.switchToHttp().getResponse();

                // 1. Establecer encabezados estáticos
                const additionalHeaders = {
                    nombreAplicacion: 'Back for front - Auto Enrolamiento Compraqui/Caja Vecina - Compraqui',
                    codigoAplicacion: 'ESA',
                    canal: 'Presencial',
                };

                for (const [key, value] of Object.entries(additionalHeaders)) {
                    response.setHeader(key, value);
                }

                // 2. Establecer encabezados dinámicos si existen metadatos
                if (headersMetadata) {
                    const { funcionalidad, etapa, operacion } = headersMetadata;
                    console.log({ headersMetadata });


                    const funcionalidadValue = this.configService.get<string>(funcionalidad, 'default_funcionalidad');
                    const etapaValue = this.configService.get<string>(etapa, 'default_etapa');
                    const operacionValue = this.configService.get<string>(operacion, 'default_operacion');

                    if (funcionalidadValue) {
                        response.setHeader('funcionalidad', funcionalidadValue);
                    }
                    if (etapaValue) {
                        response.setHeader('etapa', etapaValue);
                    }
                    if (operacionValue) {
                        response.setHeader('operacion', operacionValue);
                    }
                }

                // 3. Eliminar encabezados no deseados
                response.removeHeader('X-Powered-By');
            }),
        );
    }
}
