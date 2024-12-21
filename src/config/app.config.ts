// src/config/app.config.ts
import { registerAs } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

export class AppConfiguration {
  static getConfig() {
    const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH;
    const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH;

    console.log('JWT_PRIVATE_KEY_PATH:', privateKeyPath);
    console.log('JWT_PUBLIC_KEY_PATH:', publicKeyPath);

    if (!privateKeyPath || !publicKeyPath) {
      throw new Error('Las rutas de las claves PEM no están definidas en las variables de entorno.');
    }

    const resolvedPrivateKeyPath = path.resolve(process.cwd(), privateKeyPath);
    const resolvedPublicKeyPath = path.resolve(process.cwd(), publicKeyPath);

    console.log('Resolved Private Key Path:', resolvedPrivateKeyPath);
    console.log('Resolved Public Key Path:', resolvedPublicKeyPath);

    if (!fs.existsSync(resolvedPrivateKeyPath)) {
      throw new Error(`La clave privada no existe en la ruta: ${resolvedPrivateKeyPath}`);
    }

    if (!fs.existsSync(resolvedPublicKeyPath)) {
      throw new Error(`La clave pública no existe en la ruta: ${resolvedPublicKeyPath}`);
    }

    const privateKey = fs.readFileSync(resolvedPrivateKeyPath, 'utf8');
    const publicKey = fs.readFileSync(resolvedPublicKeyPath, 'utf8');

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
        tableName: process.env.DYNAMODB_TABLE_NAME || 'payments',
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
          acronimo_full: 'CNB.HTC',
        },
      },
    };
  }
}
