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

      endpoints: {
        healthcheck: {
          funcionalidad: 'healthcheck',
          etapa: 'healthcheck',
          operacion: 'healthcheck',
          url: 'healthcheck',
          acronimo: 'HTC',
          acronimo_full: 'CNB.HTC',
        }
      }
    };
  }
}
