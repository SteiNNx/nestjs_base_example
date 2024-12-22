// src/modules/auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './repositories/auth.repository';
import { IUser } from './interfaces/auth.interface';

// Ejemplo de uso de excepciones personalizadas:
import { BusinessError } from 'src/common/exceptions/business.exception';
// Podrías usar TechnicalError, AdapterError, etc. según necesites.

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) { }

  /**
   * Valida las credenciales del usuario consultando en DynamoDB.
   * @param username Nombre de usuario.
   * @param pass Contraseña del usuario.
   * @returns Objeto de usuario (sin password) si las credenciales son válidas, de lo contrario lanza excepción.
   */
  async validateUser(username: string, pass: string): Promise<IUser> {
    const user = await this.authRepository.getUserByUsername(username);

    // Si el usuario existe y el password coincide, retornamos el objeto sin password.
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result as IUser;
    }

    // Si no, lanzamos un BusinessError con código 401 o 400, según prefieras.
    // "BUSINESS.401" es un código interno de ejemplo
    throw new BusinessError(
      'BUSINESS.401',
      'Credenciales inválidas',
      401,
    );
  }

  /**
   * Genera un token JWT para el usuario autenticado.
   * @param user Objeto de usuario (sin password).
   * @returns Objeto con el `access_token`.
   */
  async login(user: IUser) {
    const payload = {
      username: user.username,
      sub: user.userId,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
