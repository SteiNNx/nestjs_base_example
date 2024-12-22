// src/modules/auth/dto/login.dto.ts

import { IsString, MinLength } from 'class-validator';

export class LoginDto {
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
}
