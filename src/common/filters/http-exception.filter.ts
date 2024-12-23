// src/common/filters/http-exception.filter.ts

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseError } from '../exceptions/base.exception';

@Catch(BaseError)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: BaseError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status = exception.getStatus();

        response.status(status).json({
            statusCode: status,
            code: exception.code,
            message: exception.message,
            errors: exception.errors,
            cause: exception.cause,
        });
    }
}
