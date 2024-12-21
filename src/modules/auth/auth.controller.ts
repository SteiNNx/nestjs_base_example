// src/modules/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

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
     * @throws UnauthorizedException Si las credenciales son inválidas.
     */
    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        const user = await this.authService.validateUser(
            body.username,
            body.password,
        );
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        return this.authService.login(user);
    }
}
