// src/components/signature/signature.controller.js

const { signXMLModule } = require('./signature.module');
const AuthError = require('../../exceptions/auth.exception');
const BadRequestError = require('../../exceptions/bad-request.exception');
const BusinessError = require('../../exceptions/bussiness.exception');
const InternalServerError = require('../../exceptions/internal-server.exception');
const TechnicalError = require('../../exceptions/technical.exception');
const ValidationError = require('../../exceptions/validation.exception');
const LoggerHelper = require('../../helpers/logger.helper');

const logger = new LoggerHelper('signature.controller');

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * Operación para firmar un XML.
 *
 * @async
 * @function signXMLController
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @param {NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<Response>} Respuesta con el estado 200 y el XML firmado.
 */
const signXMLController = async (req, res, next) => {
  logger.info('--------- [signature.controller] [signXMLController] - INIT ---------');

  try {
    logger.info('--------- [signature.controller] [signXMLController] - Step: Llamando signXMLModule ---------');

    const response = await signXMLModule(req);

    logger.info('--------- [signature.controller] [signXMLController] - Step: Respuesta de signXMLModule ---------', { response: response });
    logger.info('--------- [signature.controller] [signXMLController] - END ---------');

    // Configuración de cabeceras de seguridad
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "script-src 'self'");

    return res.status(200)
      .type('application/xml')
      .send(response);

  } catch (error) {
    logger.error('--------- [signature.controller] [signXMLController] - ERROR ---------', { error: error.message });

    // Manejo de errores específicos
    if (
      error instanceof AuthError ||
      error instanceof BadRequestError ||
      error instanceof BusinessError ||
      error instanceof InternalServerError ||
      error instanceof TechnicalError ||
      error instanceof ValidationError
    ) {
      return next(error);
    }

    // Manejo de errores desconocidos
    return next(
      new TechnicalError(
        'SIGN.SIGNED.0005',
        'Error Desconocido.',
        500,
        error
      )
    );
  }


};

module.exports = {
  signXMLController,
};
