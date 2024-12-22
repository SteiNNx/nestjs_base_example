// src/common/exceptions/validation.exception.ts

import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base.exception';

/**
 * Clase para manejar errores de validación de dominio.
 * Hereda de `BaseError`.
 */
export class ValidationError extends BaseError {
    constructor(
        code: string,
        message: string,
        statusCode: number = HttpStatus.UNPROCESSABLE_ENTITY, // 422
        cause?: Error,
        errors: any[] = [],
    ) {
        super({
            message,
            code,
            name: 'ValidationError',
            statusCode,
            cause,
            errors,
        });
    }
}
