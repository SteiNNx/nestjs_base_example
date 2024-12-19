// src/config/app.config.ts
export class AppConfiguration {
  static getConfig() {
    return {
      environment: process.env.NODE_ENV || 'development',
      port: parseInt(process.env.PORT || '3000', 10),
      projectName: process.env.PROJECT_NAME,
      logLevel: process.env.LOG_LEVEL || 'info',
      apiPrefix: process.env.API_PREFIX || '/api',

      // JWT
      jwt: {
        secret: process.env.JWT_SECRET || 'default_jwt_secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '3600',
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
