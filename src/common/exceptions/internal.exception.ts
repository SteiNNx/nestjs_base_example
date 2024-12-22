// src/common/exceptions/internal.exception.ts

import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base.exception';

/**
 * Clase para representar un error interno no contemplado en otras categorías.
 */
export class InternalError extends BaseError {
    constructor(
        code: string,
        message: string = 'Ha ocurrido un error interno en el servidor.',
        statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
        cause?: Error,
        errors: any[] = [],
    ) {
        super({
            message,
            code,
            name: 'InternalError',
            statusCode,
            cause,
            errors,
        });
    }
}
