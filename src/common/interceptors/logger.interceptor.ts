// src/common/interceptors/logger.interceptor.ts
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { LoggerService } from '../../core/logger.service';
import { MonitoreoService } from '../../core/monitoreo.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    constructor(
        private readonly logger: LoggerService,
        private readonly monitoreoService: MonitoreoService,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const { method, url, headers: reqHeaders } = request;

        // Crear un logger con contexto de la request
        const logger = this.logger.withContext({
            method,
            url,
            requestId: reqHeaders['x-request-id'] || 'N/A',
        });

        // Log de la petición entrante
        logger.log('Incoming Request', { headers: reqHeaders });

        return next.handle().pipe(
            tap((data) => {
                const statusCode = response.statusCode;
                const elapsedTime = Date.now() - now;

                // Obtener los encabezados de la respuesta
                const resHeaders = response.getHeaders();

                // Log de la respuesta saliente incluyendo los encabezados
                logger.log('Outgoing Response', {
                    statusCode,
                    elapsedTime: `${elapsedTime}ms`,
                    responseHeaders: resHeaders,
                    responseBody: data,
                });

                // Invocar el monitoreo
                this.monitoreoService.send({
                    statusCode,
                    elapsedTime,
                    responseBody: data,
                });
            }),
        );
    }
}
