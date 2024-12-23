// src/modules/auth/auth.controller.ts

import {
    Controller,
    Post,
    Body,
    UsePipes,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';

import { ApiOkResponse, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoggerService } from 'src/core/logger.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { HeadersMetadata } from 'src/common/decorators/headers-metadata.decorator';
import { OutputMessageSuccess } from 'src/common/interfaces/output-message-success';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';

@ApiTags('auth')
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
    @UsePipes(new ValidationPipe(LoginDto))
    @HttpCode(HttpStatus.OK)
    @HeadersMetadata({
        funcionalidad: 'endpoints.auth_login.funcionalidad',
        etapa: 'endpoints.auth_login.etapa',
        operacion: 'endpoints.auth_login.operacion',
    })
    @ApiOperation({ summary: 'Autenticar usuario y obtener token JWT' })
    @ApiOkResponse({
        description: 'Login exitoso',
        type: OutputMessageSuccess,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos de login inválidos',
    })
    async login(@Body() body: LoginDto) {
        this.logger.log(`[${AuthController.name}][login] Intento de login para usuario: ${body.username}`);

        const user = await this.authService.validateUser(body.username, body.password);
        const token = await this.authService.getToken(user);

        this.logger.log(`[${AuthController.name}][login] Login exitoso para usuario: ${body.username}`);

        const response = new OutputMessageSuccess(
            HttpStatus.OK,
            '0000',
            'Login exitoso',
            { access_token: token }
        );

        return response;
    }

    /**
     * Endpoint de registro para crear nuevos usuarios.
     * Recibe un objeto con los datos necesarios para crear un usuario.
     *
     * @param body Objeto que contiene datos del usuario a registrar.
     * @returns Objeto con el `access_token`.
     */
    @Post('register')
    @UsePipes(new ValidationPipe(RegisterDto))
    @HttpCode(HttpStatus.CREATED)
    @HeadersMetadata({
        funcionalidad: 'endpoints.auth_register.funcionalidad',
        etapa: 'endpoints.auth_register.etapa',
        operacion: 'endpoints.auth_register.operacion',
    })
    @ApiOperation({ summary: 'Registrar un nuevo usuario y obtener token JWT' })
    @ApiOkResponse({
        description: 'Registro exitoso',
        type: OutputMessageSuccess,
    })
    @ApiResponse({
        status: 400,
        description: 'Datos de registro inválidos',
    })
    async register(@Body() body: RegisterDto) {
        this.logger.log(`[${AuthController.name}][register] Intento de registro para usuario: ${body.username}`);

        const token = await this.authService.register(body);

        this.logger.log(`[${AuthController.name}][register] Registro exitoso para usuario: ${body.username}`);
        const response = new OutputMessageSuccess(
            HttpStatus.CREATED,
            '0000',
            'Registro exitoso',
            { access_token: token }
        )
        return response;
    }
}
