// src/components/signature/signature.controller.js

/**
 * Controlador para las operaciones de firma y validación de XML.
 *
 * @module signatureController
 */
const { signXMLModule, validateSignXMLModule } = require('./signature.module');

const AuthError = require('../../exceptions/auth.exception');
const BadRequestError = require('../../exceptions/bad-request.exception');
const BusinessError = require('../../exceptions/bussiness.exception');
const InternalServerError = require('../../exceptions/internal-server.exception');
const TechnicalError = require('../../exceptions/technical.exception');
const ValidationError = require('../../exceptions/validation.exception');

const OutputMessageSuccess = require('../../schemas/response/output-message-success.schema');
const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('signature.controller');

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * Firma un XML utilizando la información enviada en la solicitud.
 *
 * @async
 * @function signXMLController
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @param {NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<Response>} Respuesta HTTP con el XML firmado y cabeceras de seguridad.
 */
const signXMLController = async (req, res, next) => {
  logger.info('[signXMLController] Inicio');

  try {
    logger.info('[signXMLController] Llamando a signXMLModule');

    const responseXML = await signXMLModule(req);

    logger.info('[signXMLController] Respuesta recibida de signXMLModule', { responseXML });

    // Configuración de cabeceras de seguridad
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "script-src 'self'");

    logger.info('[signXMLController] Finalización exitosa');

    return res.status(200)
      .type('application/xml')
      .send(responseXML);

  } catch (error) {
    logger.error('[signXMLController] Error en la firma del XML', { error: error.message });
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
        'Error desconocido al firmar el XML.',
        500,
        error
      )
    );
  }
};

/**
 * Valida la firma de un XML a partir de la información enviada en la solicitud.
 *
 * @async
 * @function validateSignXMLController
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @param {NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<Response>} Respuesta HTTP con el resultado de la validación.
 */
const validateSignXMLController = async (req, res, next) => {
  logger.info('[validateSignXMLController] Inicio');

  try {
    logger.info('[validateSignXMLController] Llamando a validateSignXMLModule');
    const validationResult = await validateSignXMLModule(req);

    const responseData = {
      success: true,
      validSignature: validationResult.isValid,
      details: validationResult.details,
    };

    logger.info('[validateSignXMLController] Resultado de validación recibido', { validationResult });

    // Configuración de cabeceras de seguridad
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "script-src 'self'");

    const outPutResponse = new OutputMessageSuccess(200, '0000', 'OK', responseData);
    logger.info('[validateSignXMLController] Finalización exitosa');

    return res.status(200)
      .json(outPutResponse);

  } catch (error) {
    logger.error('[validateSignXMLController] Error al validar la firma del XML', { error: error.message });
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
        'SIGN.VALIDATE.0005',
        'Error desconocido al validar la firma.',
        500,
        error
      )
    );
  }
};

module.exports = {
  signXMLController,
  validateSignXMLController,
};
