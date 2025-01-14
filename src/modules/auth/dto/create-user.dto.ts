// src/modules/auth/dto/create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: 'Nombre de usuario único',
        example: 'john_doe',
        minLength: 3,
    })
    @IsString()
    @MinLength(3, {
        message: 'El username debe tener al menos 3 caracteres',
    })
    username: string;

    @ApiProperty({
        description: 'Contraseña segura del usuario',
        example: 'strongPassword123',
        minLength: 3,
    })
    @IsString()
    @MinLength(3, {
        message: 'La contraseña debe tener al menos 3 caracteres',
    })
    password: string;

    @ApiProperty({
        description: 'Identificador único del usuario',
        example: 1,
    })
    @IsNumber()
    userId: number;

    @ApiProperty({
        description: 'Rol asignado al usuario',
        example: 'admin',
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
