// src/middlewares/global-error-handler.middleware.js

const ValidationError = require('../exceptions/validation.exception');
const OutputMessageError = require('../schemas/response/output-message-error.schema');
const LoggerHelper = require('../helpers/logger.helper');

const logger = new LoggerHelper('global-error-handler.middleware');

/**
 * Middleware global para el manejo de errores en la aplicación.
 * Captura todos los errores lanzados, registra detalles y envía una respuesta uniforme al cliente.
 *
 * @async
 * @function globalErrorHandlerMiddleware
 * @param {Error} err - Objeto de error lanzado.
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {import('express').NextFunction} next - Función para pasar al siguiente middleware.
 * @returns {Promise<void>} No retorna nada, solo envía una respuesta HTTP al cliente.
 */
const globalErrorHandlerMiddleware = async (err, req, res, next) => {
    // ============================================================================
    // 1) Extracción de identificadores de seguimiento de la cabecera
    // ============================================================================
    const requestId = req.headers['x-request-id'] || req.headers['xrequestid'] || null;
    const trackId = req.headers['x-track-id'] || req.headers['xtrackid'] || null;

    // ============================================================================
    // 2) Desestructuración del objeto de error con valores predeterminados
    // ============================================================================
    let {
        name = 'globalErrorHandlerMiddleware',
        code = 'CQR.MDW.001',
        message = 'Error interno del servidor',
        statusCode = 500,
        errors = [],
        cause = null,
        stack = null,
    } = err;

    let {
        code: codeErrorCauseChildren = null,
        name: nameErrorCauseChildren = null,
        message: messageErrorCauseChildren = null,
        stack: stackErrorCauseChildren = null,
    } = cause || {};

    // ============================================================================
    // 3) Ajuste específico para errores de validación
    // ============================================================================
    if (err instanceof ValidationError) {
        // Se elimina el stack de error proveniente de ZodError (u otro)
        messageErrorCauseChildren = '';
    }

    // ============================================================================
    // 4) Creación del objeto de respuesta de error
    // ============================================================================
    const responseOutputMessageError = new OutputMessageError(
        name,
        statusCode,
        code,
        message,
        null,
        {
            message: messageErrorCauseChildren,
            errors: errors
        }
    );

    // ============================================================================
    // 5) Registro de logs de la operación de manejo del error
    // ============================================================================
    try {
        logger.info('------------- INIT Error Reporting -------------');
        logger.info(`Endpoint: ${req.method} ${req.originalUrl}`);
        logger.info(`Fecha y hora: ${new Date().toISOString()}`);
        logger.info(`Track ID: ${trackId}`);
        logger.info(`Request ID: ${requestId}`);
        logger.info(`Código de error: ${code}`);
        logger.info(`Tipo de error: ${name}`);
        logger.info(`Mensaje de error: ${message}`);
        logger.info('------------- END Error Reporting -------------');
    } catch (logError) {
        logger.error('Error al generar el log:', { error: logError.message });
    }

    // ============================================================================
    // 6) Establecimiento de cabeceras de seguridad y encabezado personalizado
    // ============================================================================
    res.setHeader('operacionstatuscode', code);
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader("Content-Security-Policy", "script-src 'self'");

    // ============================================================================
    // 7) Envío de la respuesta de error al cliente
    // ============================================================================
    res.status(statusCode).json(responseOutputMessageError);
};

module.exports = globalErrorHandlerMiddleware;
