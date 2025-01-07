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
    /**
     * @property {string} context - Contexto (nombre del módulo o componente) para los logs.
     */
    this.context = moduleName;
  }

  /**
   * Método para logs de nivel info.
   * 
   * @example
   * logger.info('Mensaje de info'); 
   * logger.info('Mensaje con objeto', { foo: 'bar' });
   * 
   * @param {string} message - Mensaje a loguear.
   * @param {object} [meta] - (Opcional) Objeto con propiedades adicionales a mostrar en el log.
   */
  info(message, meta = {}) {
    logger.info({ context: this.context, ...meta }, message);
  }

  /**
   * Método para logs de nivel error.
   * 
   * @example
   * logger.error('Mensaje de error');
   * logger.error('Mensaje de error con datos', { reason: 'Algo falló' });
   *
   * @param {string} message - Mensaje a loguear.
   * @param {object} [meta] - (Opcional) Objeto con propiedades adicionales a mostrar en el log.
   */
  error(message, meta = {}) {
    logger.error({ context: this.context, ...meta }, message);
  }

  /**
   * Método para logs de nivel warn.
   * 
   * @example
   * logger.warn('Mensaje de warn');
   * logger.warn('Mensaje con información adicional', { critical: false });
   * 
   * @param {string} message - Mensaje a loguear.
   * @param {object} [meta] - (Opcional) Objeto con propiedades adicionales a mostrar en el log.
   */
  warn(message, meta = {}) {
    logger.warn({ context: this.context, ...meta }, message);
  }

  /**
   * Método para logs de nivel debug.
   *
   * @example
   * logger.debug('Mensaje de debug');
   * logger.debug('Mensaje con datos', { debugData: 'algo' });
   *
   * @param {string} message - Mensaje a loguear.
   * @param {object} [meta] - (Opcional) Objeto con propiedades adicionales a mostrar en el log.
   */
  debug(message, meta = {}) {
    logger.debug({ context: this.context, ...meta }, message);
  }

  /**
   * Método para logs de nivel trace.
   *
   * @example
   * logger.trace('Mensaje de trace');
   * logger.trace('Mensaje con datos', { traceId: 'abc123' });
   *
   * @param {string} message - Mensaje a loguear.
   * @param {object} [meta] - (Opcional) Objeto con propiedades adicionales a mostrar en el log.
   */
  trace(message, meta = {}) {
    logger.trace({ context: this.context, ...meta }, message);
  }
}

module.exports = LoggerHelper;
