// src/core/logger.service.ts
import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pino from 'pino';

@Injectable()
export class LoggerService implements NestLoggerService {
  private pinoLogger: pino.Logger;

  constructor(private readonly configService: ConfigService) {
    const env = this.configService.get<string>('NODE_ENV', 'development');
    const logLevel = this.configService.get<string>('LOG_LEVEL', env === 'production' ? 'info' : 'debug');
    const projectName = this.configService.get<string>('PROJECT_NAME', 'default-project');

    this.pinoLogger = pino({
      level: logLevel,
      base: {
        serviceName: projectName,
        environment: env,
      },
      formatters: {
        level(label) {
          return { level: label };
        },
      },
      transport: env === 'production'
        ? undefined
        : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
    });
  }

  /**
   * Permite inyectar información contextual extra en el logger.
   */
  withContext(context: Record<string, unknown>): LoggerService {
    const child = this.pinoLogger.child(context);
    const newLogger = new LoggerService(this.configService);
    newLogger.setPinoLogger(child);
    return newLogger;
  }

  private setPinoLogger(logger: pino.Logger) {
    this.pinoLogger = logger;
  }

  log(message: string, ...optionalParams: any[]) {
    this.pinoLogger.info({ ...this.extractMeta(optionalParams) }, message);
  }

  error(message: string, ...optionalParams: any[]) {
    const meta = this.extractMeta(optionalParams);
    this.pinoLogger.error({ err: meta.error, ...meta.rest }, message);
  }

  warn(message: string, ...optionalParams: any[]) {
    this.pinoLogger.warn({ ...this.extractMeta(optionalParams) }, message);
  }

  debug(message: string, ...optionalParams: any[]) {
    this.pinoLogger.debug({ ...this.extractMeta(optionalParams) }, message);
  }

  verbose(message: string, ...optionalParams: any[]) {
    this.pinoLogger.debug({ ...this.extractMeta(optionalParams) }, message);
  }

  /**
   * Extrae metadata y error si existe.
   */
  private extractMeta(params: any[]): { error?: Error; rest?: Record<string, unknown> } {
    let error: Error | undefined;
    let rest: Record<string, unknown> = {};

    for (const param of params) {
      if (param instanceof Error) {
        error = param;
      } else if (typeof param === 'object') {
        rest = { ...rest, ...param };
      }
    }

    return { error, rest };
  }
}
