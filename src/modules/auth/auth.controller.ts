// src/modules/auth/auth.controller.ts

import {
    Controller,
    Post,
    Body,
    UsePipes,
    HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthValidationPipe } from './pipes/auth-validation.pipe';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoggerService } from 'src/core/logger.service';
import { ApiOkResponse, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OutputMessageSuccess } from 'src/common/interfaces/output-message-success';

@ApiTags('auth') // Categoriza este controlador en Swagger bajo "auth"
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly logger: LoggerService,
    ) { }

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
    @HttpCode(200) // Indica explícitamente que la respuesta es 200 OK
    @ApiOperation({ summary: 'Autenticar usuario y obtener token JWT' })
    @ApiOkResponse({
        description: 'Login exitoso',
        type: OutputMessageSuccess,
    })
    async login(@Body() body: LoginDto) {
        this.logger.log(`Intento de login para usuario: ${body.username}`);
        const user = await this.authService.validateUser(body.username, body.password);
        this.logger.log(`Login exitoso para usuario: ${body.username}`);
        const token = await this.authService.getToken(user);
        return new OutputMessageSuccess(200, 'SUCCESS.LOGIN', 'Login exitoso', { access_token: token });
    }

    /**
     * Endpoint de registro para crear nuevos usuarios.
     * Recibe un objeto con los datos necesarios para crear un usuario.
     *
     * @param body Objeto que contiene datos del usuario a registrar.
     * @returns Objeto con el `access_token`.
     */
    @Post('register')
    @UsePipes(new AuthValidationPipe(RegisterDto))
    @HttpCode(200)
    @ApiOperation({ summary: 'Registrar un nuevo usuario y obtener token JWT' })
    @ApiOkResponse({
        description: 'Registro exitoso',
        type: OutputMessageSuccess,
    })
    async register(@Body() body: RegisterDto) {
        this.logger.log(`Intento de registro para usuario: ${body.username}`);
        const token = await this.authService.register(body);
        this.logger.log(`Registro exitoso para usuario: ${body.username}`);
        return new OutputMessageSuccess(200, 'SUCCESS.REGISTER', 'Registro exitoso', { access_token: token });
    }
}
