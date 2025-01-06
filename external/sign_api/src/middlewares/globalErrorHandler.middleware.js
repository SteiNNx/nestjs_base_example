
const ValidationError = require('../exceptions/validation.exception');

const config = require('../config/config');
const OutputMessageError = require('../schemas/response/outputmessageerror.schema');
const LoggerHelper = require('../helpers/logger.helper');

const logger = new LoggerHelper('globalErrorHandler.middleware');

/**
* Middleware global para el manejo de errores en la aplicación.
* Captura todos los errores lanzados, registra detalles y envía una respuesta uniforme al cliente.
*
* @async
* @function globalErrorHandlerMiddleware
* @param {Error} err - El objeto de error lanzado.
* @param {import('express').Request} req - El objeto de la solicitud HTTP.
* @param {import('express').Response} res - El objeto de la respuesta HTTP.
* @param {import('express').NextFunction} next - La función para pasar al siguiente middleware.
* @returns {Promise<void>} - No retorna nada, solo envía una respuesta HTTP al cliente.
*/
const globalErrorHandlerMiddleware = async (err, req, res, next) => {
    // Obtener IDs de seguimiento de las cabeceras de la solicitud
    const requestId = req.headers['x-request-id'] || req.headers['xrequestid'] || null;
    const trackId = req.headers['x-track-id'] || req.headers['xtrackid'] || null;

    // Desestructurar el objeto de error con valores predeterminados
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

    switch (true) {
        case err instanceof ValidationError:
            /** 
             * Fix: se quita stackerror ZodError
             */
            messageErrorCauseChildren = '';
            break;
        default:
            break;
    }

    /**
     * Crea un objeto de respuesta utilizando la clase OutputMessageError.
     * 
     * @type {OutputMessageError}
     */
    const responseOutputMessageError = new OutputMessageError(
        name,
        statusCode,
        code,
        message,
        null,
        {
            //name: nameErrorCauseChildren,
            //code: codeErrorCauseChildren,
            message: messageErrorCauseChildren,
            errors: errors
        }
    );

    try {
        logger.info('------------- INIT Error Reporting -------------');
        logger.info(`Endpoint: ${req.method} ${req.originalUrl}`);
        logger.info(`Fecha y hora: ${new Date().toISOString()}`);
        logger.info(`Track ID: ${trackId}`);
        logger.info(`HTTP Code Response: ${requestId}`);
        logger.info(`Código de error: ${code}`);
        logger.info(`Tipo de error: ${name}`);
        logger.info(`Mensaje de error: ${message}`);
        logger.info('------------- END Error Reporting -------------');

    } catch (logError) {
        logger.error('Error al generar el log:');
    }

    // **Establecer el nuevo encabezado `operacionstatuscode`** para usarlo en trafficMonitorMiddlewares
    res.setHeader('operacionstatuscode', code);

    /**
     * This code resolve fix issue checkmark CWE:346
     * - checkmark ignora el middleware src/middlewares/securityHeader.middleware
     */
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader("Content-Security-Policy", "script-src 'self'");
    /** */

    // Enviar la respuesta de error
    res.status(statusCode).json(responseOutputMessageError);
};

module.exports = globalErrorHandlerMiddleware;
