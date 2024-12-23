// src/main.ts

// Importaciones principales de NestJS
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

// Importaciones para el logging y seguridad
import { LoggerService } from './core/logger.service';
import helmet from 'helmet'; // Middleware de seguridad para proteger la aplicación
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

// Importaciones de Swagger para la documentación de la API
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);

  const apiPrefix = configService.get<string>('API_PREFIX', 'api');
  const port = configService.get<number>('PORT', 3000);

  app.setGlobalPrefix(apiPrefix);
  app.useGlobalFilters(new HttpExceptionFilter());

  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  // Configura Swagger solo si no está en un entorno de producción
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('API de Autenticación') // Título de la documentación
      .setDescription('Documentación de la API de autenticación') // Descripción de la API
      .setVersion('1.0') // Versión de la API
      .addTag('auth') // Etiqueta para categorizar los endpoints relacionados con autenticación
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    logger.log(`Documentación Swagger disponible en: http://localhost:${port}/api-docs`);
  }

  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}/${apiPrefix}`);
}

// Ejecuta la función bootstrap para iniciar la aplicación
bootstrap();
