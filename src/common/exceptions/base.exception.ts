import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Clase base para implementar errores personalizados.
 * Extiende `HttpException` de NestJS y permite añadir propiedades
 * personalizadas como códigos de error, estado HTTP, causa del error y errores relacionados.
 */
export class BaseError extends HttpException {
    public code: string;
    public errors: any[];
    public cause: {
        code?: string;
        name?: string;
        message?: string;
        stack?: string;
    };

    constructor({
        message,
        code,
        name,
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
        cause,
        errors = [],
    }: {
        message: string;
        code: string;
        name?: string;
        statusCode?: number;
        cause?: Error;
        errors?: any[];
    }) {
        // Construimos la respuesta que verá el cliente
        const response = {
            statusCode,
            code,
            message,
            errors,
            cause: cause
                ? {
                    code: (cause as any).code || '',
                    name: cause.name || '',
                    message: cause.message || '',
                    stack: cause.stack || '',
                }
                : undefined,
        };

        super(response, statusCode);

        this.code = code;
        this.name = name || 'BaseError';
        this.errors = errors;
        this.cause = response.cause || {};
    }
}
