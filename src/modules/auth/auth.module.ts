// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { Algorithm } from 'jsonwebtoken'; // Importar el tipo Algorithm

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importa ConfigModule para acceder a las variables de entorno
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => {
        const privateKey = configService.get<string>('jwt.privateKey');
        const publicKey = configService.get<string>('jwt.publicKey');
        const algorithm = configService.get<string>('jwt.algorithms') || 'RS256';
        const expiresIn = configService.get<string>('jwt.expiresIn') || '3600s';

        // Validar que el algoritmo es válido
        const validAlgorithms: Algorithm[] = ['RS256', 'HS256', 'HS384', 'HS512', 'RS384', 'RS512'];
        if (!validAlgorithms.includes(algorithm as Algorithm)) {
          throw new Error(`Algoritmo JWT no válido: ${algorithm}. Algoritmos permitidos: ${validAlgorithms.join(', ')}`);
        }

        return {
          privateKey,
          signOptions: {
            algorithm: algorithm as Algorithm, // Asegurar el tipo correcto
            expiresIn,
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
