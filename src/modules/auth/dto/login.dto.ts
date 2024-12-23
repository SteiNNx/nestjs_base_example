// src/modules/auth/dto/login.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'Nombre de usuario para autenticación',
        example: 'john_doe',
        minLength: 3,
    })
    @IsString()
    @MinLength(3, {
        message: 'El username debe tener al menos 3 caracteres',
    })
    username: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'strongPassword123',
        minLength: 3,
    })
    @IsString()
    @MinLength(3, {
        message: 'La contraseña debe tener al menos 3 caracteres',
    })
    password: string;
}
