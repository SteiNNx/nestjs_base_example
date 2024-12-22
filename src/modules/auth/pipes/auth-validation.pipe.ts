// src/modules/auth/pipes/auth-validation.pipe.ts

import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ValidationError as CustomValidationError } from 'src/common/exceptions/validation.exception';

@Injectable()
export class AuthValidationPipe<T extends object> implements PipeTransform<unknown, T> {
    constructor(private readonly dto: ClassConstructor<T>) { }

    transform(value: unknown, metadata: ArgumentMetadata): T {
        // Convertimos el objeto a una instancia de la clase DTO
        const dtoObj = plainToInstance(this.dto, value);

        // Valida sincrónicamente (puedes usar validateAsync si prefieres)
        const errors = validateSync(dtoObj, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
            // Mapeamos los errores de class-validator a tu formato de "validationIssues"
            const validationIssues = errors.map((err) => {
                const field = err.property;
                const messages = Object.values(err.constraints ?? {});
                return { field, message: messages.join(', ') };
            });

            // Lanzamos ValidationError personalizado
            throw new CustomValidationError(
                'VALIDATION.001',
                'Datos de entrada no válidos.',
                422,           // Unprocessable Entity
                undefined,     // Opcionalmente puedes pasar un objeto Error como 'cause'
                validationIssues,
            );
        }

        // Retorna el objeto validado y transformado a DTO
        return dtoObj;
    }
}
