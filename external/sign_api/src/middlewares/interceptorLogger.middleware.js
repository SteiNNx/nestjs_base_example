// src/middlewares/interceptorLogger.middleware.js

const Logger = require('../helpers/logger.helper');
const logger = new Logger('InterceptorLogger.middleware');

/**
 * Middleware que intercepta la petición de entrada (headers, body)
 * y la respuesta (statusCode, responseBody). Registra toda la información
 * en logs, siguiendo el formato de los demás archivos.
 *
 * @function InterceptorLoggerMiddleware
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express
 * @param {import('express').Response} res - Objeto de respuesta HTTP de Express
 * @param {import('express').NextFunction} next - Función para ceder el control al siguiente middleware
 */
const InterceptorLoggerMiddleware = (req, res, next) => {
  // Log de la petición entrante (REQUEST IN)
  logger.info(
    '--------- [InterceptorLogger] [REQUEST IN] - Step: Detalles de la Request ---------',
    {
      requestMethod: req.method,
      requestUrl: req.url,
      requestHeaders: req.headers,
      requestBody: req.body,
    }
  );

  // Guardamos la implementación original de res.send
  const originalSend = res.send;

  // Sobrescribimos res.send para registrar la respuesta antes de enviarla (RESPONSE OUT)
  res.send = function (body) {
    logger.info(
      '--------- [InterceptorLogger] [RESPONSE OUT] - Step: Detalles de la Response ---------',
      {
        responseStatusCode: res.statusCode,
        responseBody: body,
      }
    );

    // Llamamos a la implementación original de res.send
    return originalSend.call(this, body);
  };

  // Pasamos el control al siguiente middleware
  next();
};

module.exports = InterceptorLoggerMiddleware;
