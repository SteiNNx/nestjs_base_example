// src/modules/auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './repositories/auth.repository';
// Opcional: importar la interfaz
import { IUser } from './interfaces/auth.interface';

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
   * @returns Objeto de usuario (sin password) si las credenciales son válidas, de lo contrario null.
   */
  async validateUser(username: string, pass: string): Promise<IUser | null> {
    const user = await this.authRepository.getUserByUsername(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result as IUser; // casteo a la interfaz sin el password
    }
    return null;
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
