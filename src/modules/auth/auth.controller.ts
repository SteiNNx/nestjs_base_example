// src/modules/auth/auth.controller.ts

import {
    Controller,
    Post,
    Body,
    UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthValidationPipe } from './pipes/auth-validation.pipe';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * Endpoint de login para autenticar usuarios.
     * Recibe un objeto con `username` y `password`.
     * Valida las credenciales y retorna un token JWT si son correctas.
     *
     * @param body Objeto que contiene `username` y `password`.
     * @returns Objeto con el `access_token`.
     */
    @Post('login')
    @UsePipes(new AuthValidationPipe(LoginDto))
    async login(@Body() body: LoginDto) {
        // Si las credenciales son inválidas, se lanzará un BusinessError (o la excepción que definimos en AuthService).
        const user = await this.authService.validateUser(body.username, body.password);
        return this.authService.getToken(user);
    }
}
