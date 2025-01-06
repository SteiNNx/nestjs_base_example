// src/helpers/logger.helper.js

/**
 * Módulo helper para la configuración y uso del logger pino.
 *
 * @module loggerHelper
 */

const pino = require('pino');

/**
 * Configuración de pino con pino-pretty para logs legibles.
 */
const logger = pino({
  level: process.env.LOG_LEVEL || 'info', // Nivel de log, configurable via variables de entorno
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,              // Colores en los logs
      translateTime: 'SYS:standard', // Formato de tiempo
      ignore: 'pid,hostname',      // Campos a ignorar
    },
  },
});

class LoggerHelper {
  /**
   * Crea una instancia del logger con un contexto específico.
   * @param {string} moduleName - Nombre del módulo o componente.
   */
  constructor(moduleName) {
    this.context = moduleName;
  }

  /**
   * Método para logs de nivel info.
   * @param {string} message - Mensaje a loguear.
   * @param  {...any} args - Argumentos adicionales.
   */
  info(message, ...args) {
    logger.info({ context: this.context }, message, ...args);
  }

  /**
   * Método para logs de nivel error.
   * @param {string} message - Mensaje a loguear.
   * @param  {...any} args - Argumentos adicionales.
   */
  error(message, ...args) {
    logger.error({ context: this.context }, message, ...args);
  }

  /**
   * Método para logs de nivel warn.
   * @param {string} message - Mensaje a loguear.
   * @param  {...any} args - Argumentos adicionales.
   */
  warn(message, ...args) {
    logger.warn({ context: this.context }, message, ...args);
  }

  /**
   * Método para logs de nivel debug.
   * @param {string} message - Mensaje a loguear.
   * @param  {...any} args - Argumentos adicionales.
   */
  debug(message, ...args) {
    logger.debug({ context: this.context }, message, ...args);
  }

  /**
   * Método para logs de nivel trace.
   * @param {string} message - Mensaje a loguear.
   * @param  {...any} args - Argumentos adicionales.
   */
  trace(message, ...args) {
    logger.trace({ context: this.context }, message, ...args);
  }
}

module.exports = LoggerHelper;
