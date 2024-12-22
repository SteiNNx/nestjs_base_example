// src/modules/auth/dto/create-user.dto.ts

import { IsString, IsNumber, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(3, {
        message: 'El username debe tener al menos 3 caracteres',
    })
    username: string;

    @IsString()
    @MinLength(3, {
        message: 'La contraseña debe tener al menos 3 caracteres',
    })
    password: string;

    @IsNumber()
    userId: number;

    @IsString()
    role: string;

    @IsString()
    created_at: string;
}
