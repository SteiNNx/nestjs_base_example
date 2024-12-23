// src/modules/auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './repositories/auth.repository';
import { IUser } from './interfaces/auth.interface';

// Importamos excepciones personalizadas
import { BusinessError } from 'src/common/exceptions/business.exception';
import { TechnicalError } from 'src/common/exceptions/technical.exception';
import { LoggerService } from 'src/core/logger.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly logger: LoggerService,
  ) { }

  /**
   * Valida las credenciales del usuario consultando en DynamoDB.
   * @param username Nombre de usuario.
   * @param pass Contraseña del usuario.
   * @returns Objeto de usuario (sin password) si las credenciales son válidas, de lo contrario lanza excepción.
   */
  async validateUser(username: string, pass: string): Promise<IUser> {
    this.logger.debug(`Validando usuario: ${username}`);
    // getUserByUsername podría lanzar un TechnicalError si hay un problema con DynamoDB
    const user = await this.authRepository.getUserByUsername(username);

    // Si el usuario no existe o la contraseña no coincide, lanzamos un BusinessError
    if (!user || user.password !== pass) {
      this.logger.warn(`Credenciales inválidas para usuario: ${username}`);
      throw new BusinessError('BUSINESS.401', 'Credenciales inválidas', 401);
    }

    // Devolvemos todo menos el password
    const { password, ...result } = user;
    this.logger.debug(`Usuario validado exitosamente: ${username}`);
    return result as IUser;
  }

  /**
   * Genera un token JWT para el usuario autenticado.
   * @param user Objeto de usuario (sin password).
   * @returns string token.
   */
  async getToken(user: IUser) {
    this.logger.debug(`Generando token JWT para usuario: ${user.username}`);
    const payload = {
      username: user.username,
      sub: user.userId,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload);
    this.logger.debug(`Token JWT generado para usuario: ${user.username}`);
    return token;
  }

  /**
   * Registra un nuevo usuario.
   * @param createUserDto Datos del usuario a crear.
   * @returns Objeto con el `access_token`.
   */
  async register(createUserDto: CreateUserDto) {
    this.logger.debug(`Registrando nuevo usuario: ${createUserDto.username}`);
    try {
      const userExists = await this.authRepository.getUserByUsername(createUserDto.username);
      if (userExists) {
        this.logger.warn(`El usuario ya existe: ${createUserDto.username}`);
        throw new BusinessError('BUSINESS.402', 'El usuario ya existe', 409);
      }

      const success = await this.authRepository.createUser(createUserDto);
      if (!success) {
        this.logger.error(`No se pudo registrar el usuario: ${createUserDto.username}`);
        throw new TechnicalError('TECH.004', 'No se pudo registrar el usuario', 500);
      }

      // Opcional: Auto-login tras registro
      const user = await this.authRepository.getUserByUsername(createUserDto.username);
      if (!user) {
        this.logger.error(`Usuario no encontrado tras registro: ${createUserDto.username}`);
        throw new TechnicalError('TECH.005', 'Usuario no encontrado tras registro', 500);
      }

      const { password, ...result } = user;
      this.logger.debug(`Usuario registrado exitosamente: ${createUserDto.username}`);
      return this.getToken(result as IUser);
    } catch (error) {
      // Si es un error personalizado, lo re-lanzamos
      if (error instanceof BusinessError || error instanceof TechnicalError) {
        this.logger.error(`Error durante registro de usuario: ${error.message}`, { error });
        throw error;
      }
      // Otros errores los encapsulamos en un TechnicalError
      this.logger.error(`Error inesperado durante el registro: ${error.message}`, { error });
      throw new TechnicalError(
        'TECH.006',
        'Error inesperado durante el registro',
        500,
        error,
      );
    }
  }

  /**
 * Valida un usuario por su ID.
 * @param userId ID del usuario.
 * @returns Objeto de usuario (sin password) si existe, de lo contrario lanza excepción.
 */
  async validateUserById(userId: number): Promise<IUser> {
    this.logger.debug(`Validando usuario por ID: ${userId}`);
    try {
      const user = await this.authRepository.getUserById(userId);
      if (!user) {
        this.logger.warn(`Usuario no encontrado con ID: ${userId}`);
        throw new BusinessError('BUSINESS.403', 'Usuario no encontrado', 404);
      }

      const { password, ...result } = user;
      this.logger.debug(`Usuario validado exitosamente por ID: ${userId}`);
      return result as IUser;
    } catch (error) {
      if (error instanceof BusinessError || error instanceof TechnicalError) {
        this.logger.error(`Error al validar usuario por ID: ${error.message}`, { error });
        throw error;
      }
      this.logger.error(`Error inesperado al validar usuario por ID: ${error.message}`, { error });
      throw new TechnicalError(
        'TECH.007',
        'Error inesperado al validar usuario por ID',
        500,
        error,
      );
    }
  }
}
