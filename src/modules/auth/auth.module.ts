// src/modules/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { Algorithm } from 'jsonwebtoken';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { DynamoDBService } from 'src/common/db/dynamodb.client';
import { AuthRepository } from './repositories/auth.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => {
        const privateKey = configService.get<string>('jwt.privateKey');
        const publicKey = configService.get<string>('jwt.publicKey');
        const algorithm = configService.get<string>('jwt.algorithms') || 'RS256';
        const expiresIn = configService.get<string>('jwt.expiresIn') || '3600s';

        const validAlgorithms: Algorithm[] = [
          'RS256',
          'HS256',
          'HS384',
          'HS512',
          'RS384',
          'RS512',
        ];
        if (!validAlgorithms.includes(algorithm as Algorithm)) {
          throw new Error(
            `Algoritmo JWT no válido: ${algorithm}. ` +
            `Algoritmos permitidos: ${validAlgorithms.join(', ')}`
          );
        }

        return {
          privateKey,
          signOptions: {
            algorithm: algorithm as Algorithm,
            expiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    AuthRepository,
    DynamoDBService,
  ],
  exports: [AuthService],
})
export class AuthModule { }
