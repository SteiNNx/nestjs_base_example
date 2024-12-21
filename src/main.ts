// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggerService } from './core/logger.service';
import helmet from 'helmet'; // Importa Helmet

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aplica Helmet como middleware de seguridad
  app.use(helmet());

  // Obtener ConfigService y LoggerService
  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);

  const apiPrefix = configService.get<string>('API_PREFIX', 'api');
  const port = configService.get<number>('PORT', 3000);

  // Aplica el prefix global a todas las rutas
  app.setGlobalPrefix(apiPrefix);

  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}/${apiPrefix}`);
}
bootstrap();
