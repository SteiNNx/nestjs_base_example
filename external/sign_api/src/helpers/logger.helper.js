// src/helpers/logger.helper.js

/**
 * Módulo helper para la configuración y uso del logger pino.
 *
 * @module loggerHelper
 */
const pino = require('pino');

/**
 * Configuración de pino con pino-pretty para logs legibles.
 * Se configura para mostrar la fecha, el nivel, el mensaje y los metadatos (por ejemplo, file).
 */
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',  // Ejemplo: [2025-01-12 18:56:28.807 -0300]
      ignore: 'pid,hostname',
      levelFirst: false,     // el nivel se imprime después de la hora si se prefiere
      singleLine: false,     // cada objeto en múltiples líneas
      hideObject: false,
      messageFormat: false,
      errorLikeObjectKeys: ['err', 'error'],
      errorProps: 'stack,message',
    },
  },
});

/**
 * Clase para generar logs con un contexto específico.
 * Los métodos formatean el mensaje para que aparezca con el contexto entre corchetes,
 * por ejemplo: "[jsonwebtoken.helper] Validando token JWT."
 */
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
   * @param {string} message - Mensaje a loguear.
   * @param {object} [meta={}] - Objeto con propiedades adicionales a mostrar en el log.
   */
  info = (message, meta = {}) => {
    const formattedMessage = `[${this.context}] ${message}`;
    logger.info({ file: this.context, ...meta }, formattedMessage);
  };

  /**
   * Método para logs de nivel error.
   * @param {string} message - Mensaje a loguear.
   * @param {object} [meta={}] - Objeto con propiedades adicionales a mostrar en el log.
   */
  error = (message, meta = {}) => {
    const formattedMessage = `[${this.context}] ${message}`;
    logger.error({ file: this.context, ...meta }, formattedMessage);
  };

  /**
   * Método para logs de nivel warn.
   * @param {string} message - Mensaje a loguear.
   * @param {object} [meta={}] - Objeto con propiedades adicionales a mostrar en el log.
   */
  warn = (message, meta = {}) => {
    const formattedMessage = `[${this.context}] ${message}`;
    logger.warn({ file: this.context, ...meta }, formattedMessage);
  };

  /**
   * Método para logs de nivel debug.
   * @param {string} message - Mensaje a loguear.
   * @param {object} [meta={}] - Objeto con propiedades adicionales a mostrar en el log.
   */
  debug = (message, meta = {}) => {
    const formattedMessage = `[${this.context}] ${message}`;
    logger.debug({ file: this.context, ...meta }, formattedMessage);
  };

  /**
   * Método para logs de nivel trace.
   * @param {string} message - Mensaje a loguear.
   * @param {object} [meta={}] - Objeto con propiedades adicionales a mostrar en el log.
   */
  trace = (message, meta = {}) => {
    const formattedMessage = `[${this.context}] ${message}`;
    logger.trace({ file: this.context, ...meta }, formattedMessage);
  };
}

module.exports = LoggerHelper;
