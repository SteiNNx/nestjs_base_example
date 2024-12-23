// src/common/strategies/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IUser } from '../../modules/auth/interfaces/auth.interface';
import { AuthService } from '../../modules/auth/auth.service';
import { TechnicalError } from '../exceptions/technical.exception';
import { LoggerService } from 'src/core/logger.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.publicKey'),
      algorithms: [configService.get<string>('jwt.algorithms') || 'RS256'],
    });
  }

  async validate(payload: any): Promise<IUser> {
    this.logger.debug(`Validando JWT para usuario: ${payload.username}`);
    const user = await this.authService.validateUserById(payload.sub);
    if (!user) {
      this.logger.warn(`Usuario no encontrado para ID: ${payload.sub}`);
      throw new TechnicalError('TECH.JWT.001', 'Usuario no encontrado', 401);
    }
    return user;
  }
}
