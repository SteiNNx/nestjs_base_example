// src/config/app.config.ts
import { registerAs } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { loadJwtKeys } from 'src/common/factories/jwt-load-keys.factory';

export class AppConfiguration {
  static getConfig() {
    // Cargamos las claves JWT usando la función del factory.
    // Si algo falla, se lanza un TechnicalError que saldrá con tu formato JSON.
    const { privateKey, publicKey } = loadJwtKeys();

    return {
      environment: process.env.NODE_ENV || 'development',
      port: parseInt(process.env.PORT || '3000', 10),
      projectName: process.env.PROJECT_NAME,
      logLevel: process.env.LOG_LEVEL || 'info',
      apiPrefix: process.env.API_PREFIX || '/api',

      // JWT
      jwt: {
        privateKey,
        publicKey,
        algorithms: process.env.JWT_ALGORITHMS || 'RS256',
        expiresIn: process.env.JWT_EXPIRATION_TIME || '3600s',
      },

      // Configuración DynamoDB
      dynamoDB: {
        tables: {
          merchants: process.env.DYNAMODB_TABLE_NAME_MERCHANTS || 'merchants',
          payments: process.env.DYNAMODB_TABLE_NAME_PAYMENTS || 'payments',
          users: process.env.DYNAMODB_TABLE_NAME_USERS || 'users',
        },
        endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'fakeAccessKeyId123',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'fakeSecretAccessKey123',
        region: process.env.AWS_REGION || 'us-west-2',
        port: parseInt(process.env.DYNAMODB_PORT, 10) || 8000,
        retry: parseInt(process.env.DYNAMODB_RETRY, 10) || 3,
      },

      endpoints: {
        healthcheck: {
          funcionalidad: 'healthcheck',
          etapa: 'healthcheck',
          operacion: 'healthcheck',
          url: 'healthcheck',
          acronimo: 'HTC',
          acronimo_full: 'CXD.HTC',
        },
        auth_login: {
          funcionalidad: 'auth_login',
          etapa: 'auth_login',
          operacion: 'auth_login',
          url: 'auth_login',
          acronimo: 'ATL',
          acronimo_full: 'CXD.ATL',
        },
        auth_register: {
          funcionalidad: 'auth_register',
          etapa: 'auth_register',
          operacion: 'auth_register',
          url: 'auth_register',
          acronimo: 'ATR',
          acronimo_full: 'CXD.ATR',
        },
        payment: {
          funcionalidad: 'payment',
          etapa: 'payment',
          operacion: 'payment',
          url: 'payment',
          acronimo: 'PAY',
          acronimo_full: 'CXD.PAY',
        },
      },
    };
  }
}
