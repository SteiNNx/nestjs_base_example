// src/modules/auth/dto/register.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        description: 'Nombre de usuario para el nuevo registro',
        example: 'jane_doe',
        minLength: 3,
    })
    @IsString()
    @MinLength(3, {
        message: 'El username debe tener al menos 3 caracteres',
    })
    username: string;

    @ApiProperty({
        description: 'Contraseña segura del usuario',
        example: 'anotherStrongPassword123',
        minLength: 6,
    })
    @IsString()
    @MinLength(6, {
        message: 'La contraseña debe tener al menos 6 caracteres',
    })
    password: string;

    @ApiProperty({
        description: 'Identificador único del usuario',
        example: 2,
    })
    @IsNumber()
    userId: number;

    @ApiProperty({
        description: 'Rol asignado al usuario',
        example: 'user',
    })
    @IsString()
    role: string;

    @ApiProperty({
        description: 'Fecha de creación del usuario',
        example: '2024-12-22T10:00:00Z',
    })
    @IsString()
    created_at: string;
}
