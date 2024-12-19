import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base.exception';

/**
 * Clase para manejar errores de negocio.
 * Hereda de `BaseError` y se utiliza para representar errores específicos
 * relacionados con la lógica de negocio.
 */
export class BusinessError extends BaseError {
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
            name: 'BusinessError',
            statusCode,
            cause,
            errors,
        });
    }
}
