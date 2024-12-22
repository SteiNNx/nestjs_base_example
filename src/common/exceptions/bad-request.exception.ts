// src/common/exceptions/bad-request.exception.ts

import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base.exception';

/**
 * Clase para manejar peticiones mal formadas (Bad Request).
 * Hereda de `BaseError`.
 */
export class BadRequestError extends BaseError {
    constructor(
        code: string,
        message: string,
        statusCode: number = HttpStatus.BAD_REQUEST,
        cause?: Error,
        errors: any[] = [],
    ) {
        super({
            message,
            code,
            name: 'BadRequestError',
            statusCode,
            cause,
            errors,
        });
    }
}
