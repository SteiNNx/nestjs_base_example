// src/middlewares/interceptor-logger.middleware.js

const Logger = require('../helpers/logger.helper');
const logger = new Logger('interceptor-logger.middleware');

/**
 * Middleware que intercepta la petición de entrada (headers, body)
 * y la respuesta (statusCode, responseBody). Registra toda la información
 * en logs para facilitar el monitoreo de la aplicación.
 *
 * @function InterceptorLoggerMiddleware
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {import('express').NextFunction} next - Función para ceder el control al siguiente middleware.
 */
const InterceptorLoggerMiddleware = (req, res, next) => {
  // ============================================================================
  // 1) Registro de detalles de la request entrante
  // ============================================================================
  logger.info(
    '[InterceptorLoggerMiddleware] [REQUEST_IN] - Detalles de la Request',
    {
      requestMethod: req.method,
      requestUrl: req.url,
      requestHeaders: req.headers,
      requestBody: req.body,
    }
  );

  // ============================================================================
  // 2) Intercepción de la respuesta para registrar sus detalles
  // ============================================================================
  // Guardamos la implementación original de res.send
  const originalSend = res.send;

  // Sobrescribimos res.send para registrar la respuesta antes de enviarla
  res.send = function (body) {
    logger.info(
      '[InterceptorLoggerMiddleware] [RESPONSE_OUT] - Detalles de la Response',
      {
        responseStatusCode: res.statusCode,
        responseBody: body,
      }
    );
    return originalSend.call(this, body);
  };

  // ============================================================================
  // 3) Paso del control al siguiente middleware
  // ============================================================================
  next();
};

module.exports = InterceptorLoggerMiddleware;
