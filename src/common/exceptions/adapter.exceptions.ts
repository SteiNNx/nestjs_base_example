// src/common/exceptions/adapter.exception.ts

import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base.exception';

/**
 * Clase para manejar errores de adaptadores (por ejemplo, integraciones con servicios externos).
 * Hereda de `BaseError` y se utiliza para representar problemas en la comunicación,
 * parseo de datos, etc.
 */
export class AdapterError extends BaseError {
    constructor(
        code: string,
        message: string,
        statusCode: number = HttpStatus.BAD_GATEWAY,
        cause?: Error,
        errors: any[] = [],
    ) {
        super({
            message,
            code,
            name: 'AdapterError',
            statusCode,
            cause,
            errors,
        });
    }
}
