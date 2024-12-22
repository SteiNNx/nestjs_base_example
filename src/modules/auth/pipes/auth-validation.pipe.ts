// src/modules/auth/pipes/auth-validation.pipe.ts

import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

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
            // Construyes un mensaje de error unificado
            const errMsg = errors
                .map((err) => Object.values(err.constraints || {}))
                .join(', ');
            throw new BadRequestException(`Error de validación: ${errMsg}`);
        }

        // Retorna el objeto validado y transformado a DTO
        return dtoObj;
    }
}
