// src/modules/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // Usuarios definidos estáticamente para propósitos de prueba
  private readonly users = [
    { userId: 1, username: 'test', password: 'test' }, // Ejemplo estático
  ];

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Valida las credenciales del usuario.
   *
   * @param username Nombre de usuario.
   * @param pass Contraseña del usuario.
   * @returns Objeto de usuario si las credenciales son válidas, de lo contrario null.
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = this.users.find(
      (user) => user.username === username && user.password === pass,
    );
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Genera un token JWT para el usuario autenticado.
   *
   * @param user Objeto de usuario.
   * @returns Objeto con el `access_token`.
   */
  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
