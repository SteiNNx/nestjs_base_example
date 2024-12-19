import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base.exception';

/**
 * Clase para manejar errores técnicos.
 * Hereda de `BaseError` y se utiliza para representar errores específicos
 * relacionados con problemas técnicos durante el funcionamiento de la aplicación.
 */
export class TechnicalError extends BaseError {
    constructor(
        code: string,
        message: string,
        statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
        cause?: Error,
        errors: any[] = [],
    ) {
        super({
            message,
            code,
            name: 'TechnicalError',
            statusCode,
            cause,
            errors,
        });
    }
}
